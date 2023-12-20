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
import ChannelCard, {
  ChannelCardLoading,
} from "@/components/cards/channelCard";
import { cn } from "@/lib/utils";
import useEvents from "@/lib/hooks/useEvents";
import { type NDKKind } from "@nostr-dev-kit/ndk";
import { uniqBy } from "ramda";
import { getTagValues } from "@/lib/nostr/utils";
import { nip19 } from "nostr-tools";

export default function ChannelsSection() {
  const { events } = useEvents({
    filter: {
      kinds: [34235 as NDKKind],
      limit: 10,
    },
  });
  const channels = uniqBy((e) => e.author.pubkey, events).map(
    (event) => event.author.pubkey,
  );
  return (
    <Section className="relative overflow-x-hidden">
      <SectionHeader className="px-5">
        <SectionTitle className="font-main text-xl font-semibold sm:text-2xl">
          Channels To Watch
        </SectionTitle>
        {/* <Button variant={"ghost"}>
          View all <RiArrowRightLine className="ml-1 h-4 w-4" />
        </Button> */}
      </SectionHeader>
      <SectionContent className="relative overflow-x-hidden">
        <HorizontalCarousel channels={channels} />
      </SectionContent>
    </Section>
  );
}
function HorizontalCarousel({ channels }: { channels: string[] }) {
  if (!channels.length) {
    return (
      <div className="scrollbar-thumb-rounded-full mr-auto flex min-w-0 max-w-full snap-x snap-mandatory overflow-x-auto pl-5 pr-[50vw] scrollbar-thin sm:pr-[200px]">
        {["", "", ""].map((_, index) => (
          <div
            key={index}
            className={cn("snap-start pl-3 sm:pl-5", index === 0 && "pl-5")}
          >
            <ChannelCardLoading className="min-w-[200px]" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="scrollbar-thumb-rounded-full mr-auto flex min-w-0 max-w-full snap-x snap-mandatory overflow-x-auto pl-5 pr-[50vw] scrollbar-thin sm:pr-[200px]">
      {channels.map((channel, index) => (
        <div
          key={index}
          className={cn("snap-start pl-3 sm:pl-5", index === 0 && "pl-5")}
        >
          <Link href={`/channel/${nip19.npubEncode(channel)}`} className="">
            <ChannelCard channelPubkey={channel} className="min-w-[200px]" />
          </Link>
        </div>
      ))}
    </div>
  );
}
