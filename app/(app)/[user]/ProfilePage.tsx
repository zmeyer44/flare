"use client";

import { useState } from "react";
import Image from "next/image";
import VerticalVideosFeed from "@/containers/feeds/VerticalVideosFeed";
import VideosGrid from "@/containers/feeds/VideosGrid";
import type { NDKKind } from "@nostr-dev-kit/ndk";
import { nip19 } from "nostr-tools";
import useProfile from "@/lib/hooks/useProfile";
import Spinner from "@/components/spinner";

export default function ProfilePage({
  pubkey,
  name,
}: {
  pubkey: string;
  name?: string;
}) {
  const npub = nip19.npubEncode(pubkey);
  const { profile } = useProfile(pubkey);
  const url = "";
  return (
    <div className="">
      <div className="relative h-[30svh] w-full overflow-hidden bg-gradient-to-b from-primary">
        {!!url && (
          <Image
            className="absolute inset-0 h-full w-full object-cover align-middle"
            src={url}
            width={400}
            height={100}
            alt="banner"
            unoptimized
          />
        )}
      </div>
    </div>
  );
}
