"use client";

import Link from "next/link";

import {
  Section,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from "@/containers/pageSection";
import { Button } from "@/components/ui/button";
import { RiArrowRightLine } from "react-icons/ri";
import MarketCard from "@/components/cards/marketCard";
import VideoCard, { VideoCardLoading } from "@/components/cards/videoCard";
import { type NDKKind } from "@nostr-dev-kit/ndk";
import { getTagValues } from "@/lib/nostr/utils";
import { uniqBy } from "ramda";
import StackedPlaylistCard, {
  LoadingStackedPlaylistCard,
} from "@/components/playlist/stackedCards";
import useEvents from "@/lib/hooks/useEvents";
import useCurrentUser from "@/lib/hooks/useCurrentUser";

export default function Feed() {
  const { follows } = useCurrentUser();

  const { events } = useEvents({
    filter: {
      authors: follows.size
        ? Array.from(follows).map((f) => f.pubkey)
        : undefined,
      kinds: [30005 as NDKKind],
    },
  });

  const processedEvents = uniqBy((e) => getTagValues("title", e.tags), events);
  if (processedEvents.length) {
    return (
      <Section className="px-5">
        <SectionHeader>
          <SectionTitle className="font-main text-2xl font-semibold md:text-3xl">
            Playlists
          </SectionTitle>
        </SectionHeader>
        <SectionContent className="md-feed-cols relative mx-auto gap-4">
          {processedEvents.map((e) => {
            return <StackedPlaylistCard key={e.id} playlist={e} />;
          })}
        </SectionContent>
      </Section>
    );
  }
  return (
    <Section className="px-5">
      <SectionHeader>
        <SectionTitle className="font-main text-2xl font-semibold sm:text-3xl">
          Playlists
        </SectionTitle>
      </SectionHeader>
      <SectionContent className="md-feed-cols relative mx-auto gap-4">
        <LoadingStackedPlaylistCard />
        <LoadingStackedPlaylistCard />
        <LoadingStackedPlaylistCard />
        <LoadingStackedPlaylistCard />
        <LoadingStackedPlaylistCard />
        <LoadingStackedPlaylistCard />
      </SectionContent>
    </Section>
  );
}
