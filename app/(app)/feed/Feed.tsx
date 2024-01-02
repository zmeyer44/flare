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

export default function Feed() {
  const { events } = useEvents({
    filter: {
      kinds: [34235 as NDKKind],
      limit: 1,
    },
  });

  const processedEvents = uniqBy((e) => getTagValues("title", e.tags), events);
  if (false && processedEvents.length) {
    return (
      <Section className="px-5">
        <SectionHeader>
          <SectionTitle className="font-main text-2xl font-semibold md:text-3xl">
            Recent Uploads
          </SectionTitle>
        </SectionHeader>
        <SectionContent className="mx-auto">
          <ul className="md-feed-cols  gap-4">
            {/* {processedEvents.map((e) => {
              return (
                <li key={e.id}>
                  <Link href={`/w/${e.encode()}`}>
                    <VideoCard event={e} />
                  </Link>
                </li>
              );
            })} */}
          </ul>
        </SectionContent>
      </Section>
    );
  }
  return (
    <Section className="px-5">
      <SectionHeader>
        <SectionTitle className="font-main text-2xl font-semibold sm:text-3xl">
          Recent Uploads {processedEvents.length}
        </SectionTitle>
      </SectionHeader>
      <SectionContent className="md-feed-cols relative mx-auto gap-4">
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
      </SectionContent>
    </Section>
  );
}
