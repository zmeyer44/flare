import { Suspense } from "react";
import HeroSection, { HeroSectionFallback } from "./_sections/Hero";
import TrendingSection from "./_sections/Trending";
import ChannelSection from "./_sections/Channels";
import PlaylistsSection from "./_sections/Playlists";

export default function Page() {
  return (
    <div className="relative isolate">
      <div className="absolute inset-x-0 top-0 hidden h-[80svh] w-full sm:block">
        <div className="relative isolate h-full w-full overflow-hidden">
          <svg
            className="absolute inset-0 z-10 h-full w-full  stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
                width={200}
                height={200}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-800/20">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              width="100%"
              height="100%"
              strokeWidth={0}
              fill="url(#ca875177-de6d-4c3f-8d64-b9761d1534cc)"
            />
          </svg>
          <div
            className="3left-[calc(50%-4rem)] absolute left-0 top-10 -z-10 transform-gpu blur-3xl max-md:translate-y-[-20%] sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
            aria-hidden="true"
          >
            <div
              className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#ffc387] to-[#e9672b] opacity-30"
              style={{
                clipPath:
                  "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
              }}
            />
          </div>
        </div>
      </div>
      <div className="relative space-y-6 pt-5 sm:pt-7">
        <Suspense fallback={<HeroSectionFallback />}>
          <HeroSection />
        </Suspense>
        <TrendingSection />
        <PlaylistsSection />
        <ChannelSection />
      </div>
    </div>
  );
}
