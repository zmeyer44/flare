import {
  Section,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from "@/containers/pageSection";
import { Button } from "@/components/ui/button";
import { RiArrowRightLine } from "react-icons/ri";
import MarketCard from "@/components/cards/marketCard";

export default function MarketsSection() {
  return (
    <Section className="px-5">
      <SectionHeader>
        <SectionTitle className="font-condensed text-2xl font-bold sm:text-3xl">
          Trending Markets
        </SectionTitle>
        <Button variant={"ghost"}>
          View all <RiArrowRightLine className="ml-1 h-4 w-4" />
        </Button>
      </SectionHeader>
      <SectionContent className="md-feed-cols relative mx-auto gap-4">
        <MarketCard />
        <MarketCard />
        <MarketCard />
        <MarketCard />
        <MarketCard />
      </SectionContent>
    </Section>
  );
}
