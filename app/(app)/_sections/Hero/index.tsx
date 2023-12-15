"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import VideoPlayer from "@/components/videoPlayer";
import { useKeyboardShortcut } from "@/lib/hooks/useKeyboardShortcut";
import SupporterLabel from "./components/supporterLabel";
type Sponsor = {
  name: string;
  href: string;
  heroText: string;
  heroTextEmphasis?: string;
  videoUrl: string;
  thumbnail?: string;
};
const sponsors: Sponsor[] = [
  {
    name: "Bitkey Wallet",
    href: "https://bitkey.world?ref=flare",
    heroText: "Everything you need",
    heroTextEmphasis: "in one wallet",
    videoUrl: "https://www.youtube.com/watch?v=aHBGSlJW65w",
    thumbnail:
      "https://www.nobsbitcoin.com/content/images/size/w2000/2023/12/bitkey-preorder.png",
  },
  {
    name: "Coinkite",
    href: "https://coldcard.com?ref=flare",
    heroText: "Secure your Bitcoin",
    heroTextEmphasis: "Sleep like a baby",
    videoUrl: "https://www.youtube.com/watch?v=qNjgs1WJfK0",
    thumbnail:
      "https://flockstr.s3.amazonaws.com/flare/sponsors/coldcard_thumbnail.png",
  },
  {
    name: "Bitcoin Magazine",
    href: "https://b.tc/conference/2024?ref=flare",
    heroText: "THE NEXT BITCOIN EPOCH",
    heroTextEmphasis: "BEGINS IN NASHVILLE",
    videoUrl: "https://www.youtube.com/watch?v=CfsF0JAMUJM",
    thumbnail: "http://i3.ytimg.com/vi/CfsF0JAMUJM/hqdefault.jpg",
  },
  {
    name: "OpenSats",
    href: "https://opensats.org?ref=flare",
    heroText: "Support Bitcoin_",
    heroTextEmphasis: "And so much more...",
    videoUrl: "https://www.youtube.com/watch?v=ver_DNla00Q",
    thumbnail: "http://i3.ytimg.com/vi/ver_DNla00Q/hqdefault.jpg",
  },
  {
    name: "River",
    href: "https://river.com/?ref=flare",
    heroText: "Invest in Bitcoin",
    heroTextEmphasis: "with confidence",
    videoUrl: "https://youtu.be/UzHrTwKu2oc",
    thumbnail:
      "https://play-lh.googleusercontent.com/qQFiO7OU9OSLlsUtjKuPqBiont37ZK7UNn2CY0oYGPqN1KqLHxLOPaAaNJe8Hf95ZRtv=w526-h296-rw",
  },
  {
    name: "Swan",
    href: "https://www.swanbitcoin.com/?ref=flare",
    heroText: "Invest in Bitcoin",
    heroTextEmphasis: "with Swan",
    videoUrl: "https://www.youtube.com/watch?v=BB3zbSLuHCA",
    thumbnail:
      "https://www.datocms-assets.com/65699/1657605701-defaultopengraph.png?auto=format&fit=crop&h=630&w=1200",
  },
  {
    name: "Fedi",
    href: "https://www.fedi.xyz/?ref=flare",
    heroText: "The all-in-one",
    heroTextEmphasis: "Freedom tool",
    videoUrl: "https://youtu.be/XgUCGALs5y4",
    thumbnail: "http://i3.ytimg.com/vi/XgUCGALs5y4/hqdefault.jpg",
  },
];

export default function HeroSection() {
  const searchParams = useSearchParams();
  const [activeSponsor, setActiveSponsor] = useState<Sponsor>(
    searchParams.has("s")
      ? sponsors[parseInt(searchParams.get("s") ?? "0")] ?? sponsors[0]!
      : sponsors[0]!,
  );
  useKeyboardShortcut(["shift", " "], () => {
    const currentIndex =
      sponsors.findIndex((s) => s.name === activeSponsor.name) ?? 0;
    if (currentIndex === sponsors.length - 1) {
      setActiveSponsor(sponsors[0]!);
    } else {
      setActiveSponsor(sponsors[currentIndex + 1]!);
    }
  });
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-x-4 gap-y-5 px-5 pb-10 md:flex-row md:pb-20">
      <div className="mt-12 flex-1 text-6xl font-semibold sm:mt-8 md:px-6 md:text-6xl lg:text-7xl">
        <SupporterLabel
          sponsorName={activeSponsor.name}
          href={activeSponsor.href}
          className="mb-6"
        />
        <h1 className="font-main text-foreground">{activeSponsor.heroText}</h1>
        <span className="font-main mt-1.5 block text-primary">
          {activeSponsor.heroTextEmphasis}
        </span>
      </div>
      <div className="max-h-[350px] w-full max-w-[450px] shrink-0 pt-4 md:mt-10 md:w-5/12 md:pt-6 lg:mt-20">
        <VideoPlayer
          autoplay={false}
          src={activeSponsor.videoUrl}
          title={activeSponsor.name}
          thumbnail={activeSponsor.thumbnail}
        />
      </div>
    </div>
  );
}
