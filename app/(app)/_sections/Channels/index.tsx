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
import VideoCard from "@/components/cards/videoCard";
import ChannelCard from "@/components/cards/channelCard";

export default function ChannelsSection() {
  return (
    <Section className="px-5">
      <SectionHeader>
        <SectionTitle className="font-condensed text-2xl font-bold sm:text-3xl">
          Channels Trending
        </SectionTitle>
        <Button variant={"ghost"}>
          View all <RiArrowRightLine className="ml-1 h-4 w-4" />
        </Button>
      </SectionHeader>
      <SectionContent className="channel-card-cols relative mx-auto gap-4">
        <Link href={`/video/1`}>
          <ChannelCard />
        </Link>
        {/* <MarketCard />
        <MarketCard />bun
        <MarketCard />
        <MarketCard /> */}
      </SectionContent>
    </Section>
  );
}
