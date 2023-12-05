import MarketCard from "@/components/cards/marketCard";
import HeroSection from "./_sections/Hero";
import TrendingSection from "./_sections/Trending";
import ChannelSection from "./_sections/Channels";

export default function Page() {
  return (
    <div className="relative space-y-6 pt-5 sm:pt-7">
      <HeroSection />
      <TrendingSection />
      <ChannelSection />
    </div>
  );
}
