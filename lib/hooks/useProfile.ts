"use client";
import { useEffect, useState } from "react";
import { nip19 } from "nostr-tools";
import { NOSTR_BECH32_REGEXP } from "@/lib/nostr/utils";
import { useNDK } from "@/app/_providers/ndk";
import followersStore from "../stores/followers";

export default function useProfile(
  key?: string,
  options?: {
    fetchFollowerCount?: boolean;
  },
) {
  const [fetchingFollowers, setFetchingFollowers] = useState(false);
  const pubkey = key
    ? NOSTR_BECH32_REGEXP.test(key)
      ? nip19.decode(key).data.toString()
      : key
    : null;
  const { followers, addFollowers } = followersStore();
  const { ndk, getProfile, fetchEvents } = useNDK();

  useEffect(() => {
    if (!ndk || !pubkey) return;

    return () => {
      if (ndk) {
        void ndk.getUser({ pubkey: pubkey }).fetchProfile();
      }
    };
  }, [pubkey, ndk, options]);

  useEffect(() => {
    if (ndk && pubkey && options?.fetchFollowerCount) {
      if (!followers.has(pubkey) && !fetchingFollowers) {
        console.log("Should fetch followers");
        void handleFetchFollowerCount(pubkey);
      }
    }
  }, [key, ndk, options]);

  async function handleFetchFollowerCount(pubkey: string) {
    if (!ndk) return;
    setFetchingFollowers(true);
    const followers = await fetchEvents({
      kinds: [3],
      ["#p"]: [pubkey],
    });
    if (followers) {
      // console.log("Found followers", followers);
      addFollowers(
        pubkey,
        Array.from(followers).map((p) => p.pubkey),
      );
    }
    setFetchingFollowers(false);
  }

  return {
    profile: pubkey ? getProfile(pubkey) : null,
    followers: pubkey ? followers.get(pubkey) ?? [] : [],
  };
}
