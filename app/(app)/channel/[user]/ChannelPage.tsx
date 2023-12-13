"use client";

import { useState } from "react";
import BannerImage from "./components/BannerImage";
import ProfileInfo from "./components/ProfileInfo";
import VerticalVideosFeed from "@/containers/feeds/VerticalVideosFeed";
import VideosGrid from "@/containers/feeds/VideosGrid";
import type { NDKKind } from "@nostr-dev-kit/ndk";
import { nip19 } from "nostr-tools";
import useProfile from "@/lib/hooks/useProfile";

import Spinner from "@/components/spinner";

export default function ChannelPage({
  pubkey,
  name,
}: {
  pubkey: string;
  name?: string;
}) {
  const npub = nip19.npubEncode(pubkey);
  const { profile } = useProfile(pubkey);

  if (!profile) {
    return (
      <div className="center">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="">
        <BannerImage url={profile.banner} />
      </div>
      <div className="lg:pt-1">
        <ProfileInfo profile={profile} pubkey={pubkey} npub={npub} />
      </div>
      <div className="pt-1 md:pt-3">
        <div className="md:hidden">
          <VerticalVideosFeed
            title="Videos"
            filter={{
              authors: [npub],
              kinds: [34235 as NDKKind],
            }}
          />
        </div>
        <div className="hidden md:block">
          <VideosGrid
            title="Videos"
            filter={{
              authors: [npub],
              kinds: [34235 as NDKKind],
            }}
          />
        </div>
      </div>
    </div>
  );
}
