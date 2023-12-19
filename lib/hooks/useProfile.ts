"use client";
import { useEffect, useState, useRef } from "react";
import { nip19 } from "nostr-tools";
import { NOSTR_BECH32_REGEXP } from "@/lib/nostr/utils";
import { useNDK } from "@/app/_providers/ndk";
import followersStore from "../stores/followers";

export default function useProfile(
  key: string,
  options?: {
    fetchFollowerCount?: boolean;
  },
) {
  const { followers, addFollowers } = followersStore();
  const { ndk, getProfile, fetchEvents } = useNDK();

  useEffect(() => {
    if (!ndk) return;
    if (NOSTR_BECH32_REGEXP.test(key)) {
      key = nip19.decode(key).data.toString();
    }
    return () => {
      if (ndk) {
        void ndk.getUser({ pubkey: key }).fetchProfile();
      }
    };
  }, [key, ndk, options]);

  useEffect(() => {
    if (ndk && options?.fetchFollowerCount) {
      console.log("Should fetch followers");
      void handleFetchFollowerCount(key);
    }
  }, [key, ndk, options]);

  async function handleFetchFollowerCount(pubkey: string) {
    if (!ndk) return;
    const followers = await fetchEvents({
      kinds: [3],
      ["#p"]: [pubkey],
    });
    console.log("Found", followers);
    if (followers) {
      console.log("Found followers", followers);
      addFollowers(
        pubkey,
        Array.from(followers).map((p) => p.pubkey),
      );
    }
  }

  return {
    profile: getProfile(key),
    followers: followers.get(key) ?? [],
  };
}
