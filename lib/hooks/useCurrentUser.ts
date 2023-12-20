"use client";
import { useEffect } from "react";
import { signOut, useSession, signIn } from "next-auth/react";
import currentUserStore from "@/lib/stores/currentUser";
// import useEvents from "@/lib/hooks/useEvents";
import { UserSchema } from "@/types";
import { useNDK } from "@/app/_providers/ndk";
import { nip19 } from "nostr-tools";
import { type NDKKind } from "@nostr-dev-kit/ndk";
import { webln } from "@getalby/sdk";
import { authEvent } from "@/lib/actions/create";

const loadNWCUrl = "";
const nwc = new webln.NWC({ nostrWalletConnectUrl: loadNWCUrl });

export default function useCurrentUser() {
  const {
    currentUser,
    setCurrentUser,
    updateCurrentUser,
    follows,
    setFollows,
    addFollow,
  } = currentUserStore();
  const { loginWithNip07, ndk } = useNDK();
  const { data: session, status: httpAuthStatus } = useSession();

  async function attemptLogin() {
    try {
      const shouldReconnect = localStorage.getItem("shouldReconnect");
      if (!shouldReconnect || typeof window.nostr === "undefined") return;
      const user = await loginWithNip07();
      console.log("Called loginWithNip07");
      if (!user) {
        throw new Error("NO auth");
      }
      const pubkey = nip19.decode(user.npub).data.toString();
      await loginWithPubkey(pubkey);
      if (typeof window.webln !== "undefined") {
        await window.webln.enable();
      }
      console.log("connected ");
    } catch (err) {
      console.log("Error at attemptLogin", err);
    }
  }

  function logout() {
    signOut();
    localStorage.removeItem("shouldReconnect");
    setCurrentUser(null);
    window.location.reload();
  }
  function handleUpdateUser(userInfo: string) {
    const userObject = UserSchema.safeParse(JSON.parse(userInfo));
    if (!userObject.success) return;
    const parsedData = UserSchema.safeParse({
      ...currentUser,
      ...userObject,
    });
    if (parsedData.success) {
      updateCurrentUser({
        profile: {
          ...parsedData.data,
          displayName: parsedData.data.display_name,
        },
      });
    }
  }

  async function loginWithPubkey(pubkey: string) {
    if (!ndk) return;
    const user = ndk.getUser({ hexpubkey: pubkey });
    console.log("user", user);
    await user.fetchProfile();

    // await db.users.add({
    //   profile: user.profile!,
    //   pubkey: pubkey,
    //   createdAt: unixTimeNowInSeconds(),
    // });
    setCurrentUser(user);
  }

  useEffect(() => {
    if (!currentUser) return;
    if (ndk?.activeUser?.pubkey && httpAuthStatus === "unauthenticated") {
      void attemptHttpLogin();
    }
  }, [currentUser, httpAuthStatus]);

  async function attemptHttpLogin() {
    if (!ndk) return;
    try {
      const event = await authEvent(ndk);
      if (!event) return;
      const authRes = await signIn("nip-98", {
        event: JSON.stringify(event),
        redirect: false,
      });
      console.log("authRes", authRes);
    } catch (err) {
      console.log("Error http login");
    }
  }

  useEffect(() => {
    if (!currentUser) return;
    console.log("fetching follows");
    (async () => {
      const following = await currentUser.follows();
      console.log("Follows", following);
      setFollows(following);
    })();
  }, [currentUser]);

  return {
    currentUser,
    isLoading: false,
    follows,
    setCurrentUser,
    logout,
    updateUser: handleUpdateUser,
    loginWithPubkey,
    attemptLogin,
    addFollow,
    setFollows,
  };
}
