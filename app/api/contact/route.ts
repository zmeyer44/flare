import { NextRequest, NextResponse } from "next/server";
import NDK, {
  NDKPrivateKeySigner,
  NDKEvent,
  NDKUser,
} from "@nostr-dev-kit/ndk";
import { RELAYS } from "@/constants";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";
import { z } from "zod";

const contactParse = z.object({
  name: z.string(),
  email: z.string(),
  message: z.string(),
});
async function handler(req: NextRequest) {
  const signer = new NDKPrivateKeySigner(
    process.env.TESTING_PRIVATE_KEY as string,
  );
  const ndkInstance = new NDK({
    explicitRelayUrls: RELAYS,
    signer,
  });
  await ndkInstance.connect(6000);
  ndkInstance.signer = signer;
  const { email, name, message } = contactParse.parse(req.body);

  const event = new NDKEvent(ndkInstance, {
    content: `Contact form submission: \n
    Name: ${name} \n
    Email: ${email}\n
    Message: ${message}`,
    pubkey: (await signer.user()).pubkey,
    kind: 4,
    tags: [
      ["p", "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58"],
    ],
    created_at: unixTimeNowInSeconds(),
  });
  await event.encrypt(
    new NDKUser({
      pubkey:
        "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
    }),
  );
  await event.sign();
  await event.publish();

  return NextResponse.json({
    message: "success",
  });
}

export { handler as GET, handler as POST };
