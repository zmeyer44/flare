"use client";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import currentUserStore from "@/lib/stores/currentUser";
// import useEvents from "@/lib/hooks/useEvents";
import { UserSchema } from "@/types";
import { useNDK } from "@/app/_providers/ndk";
import { nip19 } from "nostr-tools";
import { type NDKKind } from "@nostr-dev-kit/ndk";
import { webln } from "@getalby/sdk";

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
  const { loginWithNip07, ndk } = useNDK();
  async function attemptLogin() {
    try {
      const shouldReconnect = localStorage.getItem("shouldReconnect");
      if (!shouldReconnect || typeof window.nostr === "undefined") return;
      const user = await loginWithNip07();
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
    localStorage.removeItem("shouldReconnect");
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
  }

  // useEffect(() => {
  //   if (!currentUser || follows.size) return;
  //   console.log("fetching follows");
  //   handleFetchFollows();
  // }, [currentUser]);

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
