"use client";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import currentUserStore from "@/lib/stores/currentUser";
// import useEvents from "@/lib/hooks/useEvents";
import { UserSchema } from "@/types";
import { useNDK } from "@/app/_providers/ndk";
import { nip19, getPublicKey } from "nostr-tools";
import { NDKPrivateKeySigner, NDKSigner } from "@nostr-dev-kit/ndk";
import { webln } from "@getalby/sdk";
import { api } from "../trpc/api";
const loadNWCUrl = "";
const nwc = new webln.NWC({ nostrWalletConnectUrl: loadNWCUrl });

export default function useCurrentUser() {
  const {
    currentUser,
    setCurrentUser,
    updateCurrentUser,
    fetchingFollows,
    setFetchingFollows,
    follows,
    setFollows,
    addFollow,
  } = currentUserStore();
  const { data: sesstionData } = useSession();
  const { loginWithNip07, ndk, loginWithNip46 } = useNDK();

  const { data: dbUser } = api.user.getCurrentUser.useQuery(undefined, {
    enabled: !!sesstionData,
  });

  async function attemptLogin() {
    console.log("attemptLogin()");
    try {
      const shouldReconnect = localStorage.getItem("shouldReconnect");
      const localnip46sk = localStorage.getItem("nip46sk");
      if (!shouldReconnect && !localnip46sk) return console.log("!!");
      if (ndk?.signer) return console.log("ndk signer");
      const nip46targetPubkey = localStorage.getItem("nip46target");
      if (localnip46sk && nip46targetPubkey) {
        const user = await loginWithNip46(nip46targetPubkey, localnip46sk);
        if (user) {
          await loginWithPubkey(nip46targetPubkey);
          console.log("return nip46targetPubkey");
          return;
        }
      }
      if (typeof window.nostr !== "undefined") {
        const user = await loginWithNip07();
        if (!user) {
          throw new Error("NO auth");
        }
        const pubkey = nip19.decode(user.npub).data.toString();
        await loginWithPubkey(pubkey);
      }
      if (typeof window.webln !== "undefined") {
        await window.webln.enable();
      }
      console.log("connected ");
    } catch (err) {
      console.log("Error at attemptLogin", err);
    }
  }

  function logout() {
    localStorage.removeItem("shouldReconnect");
    localStorage.removeItem("nip46sk");
    setCurrentUser(null);
    signOut();
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
    if (typeof window.webln !== "undefined") {
      await window.webln.enable();
    }
  }

  useEffect(() => {
    if (!currentUser || follows.size) return;
    console.log("fetching follows");
    handleFetchFollows();
  }, [currentUser]);

  async function handleFetchFollows() {
    if (!currentUser || follows.size || fetchingFollows) return;
    setFetchingFollows(true);
    const following = await currentUser.follows();
    console.log("fetching follows", fetchingFollows);
    console.log("Follows", following);
    setFollows(following);
    setFetchingFollows(false);
  }

  return {
    currentUser,
    dbUser,
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
