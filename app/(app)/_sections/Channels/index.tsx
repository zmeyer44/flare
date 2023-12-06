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
import { cn } from "@/lib/utils";

export default function ChannelsSection() {
  return (
    <Section className="relative overflow-x-hidden">
      <SectionHeader className="px-5">
        <SectionTitle className="font-condensed text-2xl font-bold sm:text-3xl">
          Channels Trending
        </SectionTitle>
        <Button variant={"ghost"}>
          View all <RiArrowRightLine className="ml-1 h-4 w-4" />
        </Button>
      </SectionHeader>
      <SectionContent className="relative overflow-x-hidden">
        <HorizontalCarousel />
      </SectionContent>
    </Section>
  );
}
function HorizontalCarousel() {
  return (
    <div className="scrollbar-thumb-rounded-full mr-auto flex min-w-0 max-w-full snap-x snap-mandatory overflow-x-auto pl-5 pr-[50vw] scrollbar-thin sm:pr-[200px]">
      {["", "", ""].map((_, index) => (
        <div
          key={index}
          className={cn("snap-start pl-3 sm:pl-5", index === 0 && "pl-5")}
        >
          <Link href={`/video/1`} className="">
            <ChannelCard className="min-w-[200px]" />
          </Link>
        </div>
      ))}
    </div>
  );
}
