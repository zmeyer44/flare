import { getServerSession } from "next-auth";
import type { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import signIn from "./signIn";
import { EventSchema } from "@/types";
import { verifySignature, nip19 } from "nostr-tools";
import { unixTimeNowInSeconds } from "../nostr/dates";
import { getTagValues } from "../nostr/utils";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      npub: string;
    } & DefaultSession["user"];
  }
  interface User {
    // ...other properties
  }
}

interface Session extends DefaultSession {
  user: {
    id: string;
    npub: string;
  } & DefaultSession["user"];
}

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Email + Password auth",
      id: "email-password",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing Credentials");
        }
        const user = await signIn(credentials.email, credentials.password);
        if (user) {
          return { ...user, id: user.id.toString() };
        } else {
          throw new Error("Invalid Credentials");
        }
      },
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Event Auth",
      id: "nip-98",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        event: {
          label: "Event",
          type: "text",
        },
      },
      async authorize(credentials, req) {
        if (!credentials?.event) {
          throw new Error("Missing Event");
        }
        const event = EventSchema.parse(JSON.parse(credentials.event));

        const currentTime = unixTimeNowInSeconds();
        if (
          getTagValues("u", event.tags) !==
            process.env.NEXT_PUBLIC_AUTH_REQ_URL ||
          event.kind !== 27235
        ) {
          throw new Error("Invalid Event");
        } else if (event.created_at < currentTime - 60) {
          throw new Error("Stale Event");
        }
        const result = verifySignature(event);
        if (result) {
          return {
            id: event.pubkey,
            email: event.pubkey,
            npub: nip19.npubEncode(event.pubkey),
            pubkey: event.pubkey,
          };
        } else {
          throw new Error("Invalid Credentials");
        }
      },
    }),
  ],
  pages: {
    signIn: `/login`,
    verifyRequest: `/login`,
    error: "/login", // Error code passed in query string as ?error=
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
        domain: VERCEL_DEPLOYMENT
          ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
          : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: async ({ session, token }) => {
      const userToken = token as unknown as {
        user: {
          pubkey: string;
          npub: string;
        };
      };
      const pubkey: string = userToken.user?.pubkey ?? "";
      const npub = userToken.user?.npub ?? "";

      session.user = {
        ...session.user,
        // @ts-expect-error
        ...token.user,
        pubkey,
        npub,
        id: token.sub,
      };
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url;
    },
  },
  debug: !VERCEL_DEPLOYMENT,
};

export function getSession() {
  return getServerSession(authOptions) as Promise<Session | null>;
}

export async function getCurrentUserSession() {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return null;
    }
    const currentUser = await prisma.user.findFirst({
      where: {
        id: parseInt(session.user.id),
      },
    });
    return { ...session, user: currentUser };
  } catch (err) {
    console.log("Error");
    return null;
  }
}
export async function getCurrentUser() {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return null;
    }
    const currentUser = await prisma.user.findFirst({
      where: {
        id: parseInt(session.user.id),
      },
    });
    return currentUser;
  } catch (err) {
    console.log("Error");
    return null;
  }
}
