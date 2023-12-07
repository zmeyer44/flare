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
import ChannelCard from "@/components/cards/channelCard";
import useEvents from "@/lib/hooks/useEvents";
import { type NDKKind } from "@nostr-dev-kit/ndk";
import { getTagValues } from "@/lib/nostr/utils";
import { uniqBy } from "ramda";

export default function TrendingSection() {
  const { events } = useEvents({
    filter: {
      kinds: [30311 as NDKKind],
      limit: 10,
    },
  });

  const processedEvents = uniqBy((e) => getTagValues("title", e.tags), events);
  if (processedEvents.length) {
    return (
      <Section className="px-5">
        <SectionHeader>
          <SectionTitle className="font-condensed text-2xl font-bold sm:text-3xl">
            Trending Trending
          </SectionTitle>
          <Button variant={"ghost"}>
            View all <RiArrowRightLine className="ml-1 h-4 w-4" />
          </Button>
        </SectionHeader>
        <SectionContent className="md-feed-cols relative mx-auto gap-4">
          {processedEvents.slice(0, 12).map((e) => {
            return (
              <Link key={e.id} href={`/w/${e.tagId()}`}>
                <VideoCard event={e} />
              </Link>
            );
          })}
        </SectionContent>
      </Section>
    );
  }
  return (
    <Section className="px-5">
      <SectionHeader>
        <SectionTitle className="font-condensed text-2xl font-bold sm:text-3xl">
          Trending Trending
        </SectionTitle>
        <Button variant={"ghost"}>
          View all <RiArrowRightLine className="ml-1 h-4 w-4" />
        </Button>
      </SectionHeader>
      <SectionContent className="md-feed-cols relative mx-auto gap-4">
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
      </SectionContent>
    </Section>
  );
}
