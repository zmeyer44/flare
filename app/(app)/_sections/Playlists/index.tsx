"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Section,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from "@/containers/pageSection";
import { Button } from "@/components/ui/button";
import { RiArrowRightLine } from "react-icons/ri";
import ChannelCard, {
  ChannelCardLoading,
} from "@/components/cards/channelCard";
import { cn } from "@/lib/utils";
import { uniqBy } from "ramda";
import { getTagValues, getTagsValues } from "@/lib/nostr/utils";
import { nip19 } from "nostr-tools";
import { api } from "@/lib/trpc/api";
import useEvents from "@/lib/hooks/useEvents";
import StackedPlaylistCard, {
  LoadingStackedPlaylistCard,
} from "@/components/playlist/stackedCards";
import type { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";

export default function PlaylistsSection() {
  const { events } = useEvents({
    filter: {
      kinds: [30005 as NDKKind],
      limit: 5,
    },
  });

  const playlists = events.filter(
    (e) =>
      getTagsValues("a", e.tags).length &&
      (getTagsValues("title", e.tags) || getTagsValues("name", e.tags)),
  );

  return (
    <Section className="relative overflow-x-hidden">
      <SectionHeader className="px-5">
        <SectionTitle className="font-main text-xl font-semibold sm:text-2xl">
          Playlists
        </SectionTitle>
        {/* <Button variant={"ghost"}>
          View all <RiArrowRightLine className="ml-1 h-4 w-4" />
        </Button> */}
      </SectionHeader>
      <SectionContent className="relative overflow-hidden overflow-x-hidden">
        <HorizontalCarousel playlists={playlists} />
      </SectionContent>
    </Section>
  );
}
function HorizontalCarousel({ playlists }: { playlists: NDKEvent[] }) {
  const [ignoredChannels, setIgnoredChannels] = useState<string[]>([]);

  if (playlists.length < 3) {
    return (
      <div className="scrollbar-thumb-rounded-full mr-auto flex min-w-0 max-w-full snap-x snap-mandatory overflow-x-auto pl-5 pr-[50vw] scrollbar-thin sm:pr-[200px]">
        {["", "", ""].map((_, index) => (
          <div
            key={index}
            className={cn("snap-start pl-3 sm:pl-5", index === 0 && "pl-5")}
          >
            <LoadingStackedPlaylistCard />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="scrollbar-thumb-rounded-full mr-auto flex min-w-0 max-w-full snap-x snap-mandatory overflow-x-auto pl-5 pr-[50vw] scrollbar-thin sm:pr-[200px]">
      {playlists.map((playlist, index) => (
        <div
          key={playlist.id}
          className={cn("snap-start pl-3 sm:pl-5", index === 0 && "pl-5")}
        >
          <StackedPlaylistCard playlist={playlist} />
          {/* <Link href={`/channel/${nip19.npubEncode(channel)}`} className="">
              <ChannelCard
                channelPubkey={channel}
                hide={() => setIgnoredChannels((prev) => [...prev, channel])}
                className="min-w-[200px]"
              />
            </Link> */}
        </div>
      ))}
    </div>
  );
}
