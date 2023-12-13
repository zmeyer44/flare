import VideoPlayer from "@/components/videoPlayer";

export default function HeroSection() {
  return (
    <div className="relative isolate">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-x-4 gap-y-5 px-5 pb-10 md:flex-row md:pb-20">
        <div className="flex-1 md:px-6">
          <h1 className="font-main mt-14 text-5xl font-semibold text-foreground sm:mt-10 lg:text-6xl">
            Welcome to Flare, Lets Change the web
          </h1>
        </div>
        <div className="w-full max-w-[450px] shrink-0 pt-4 md:w-5/12 md:pt-6">
          <VideoPlayer
            src="https://www.youtube.com/watch?v=aHBGSlJW65w"
            title="Bitkey"
            thumbnail="https://www.nobsbitcoin.com/content/images/size/w2000/2023/12/bitkey-preorder.png"
          />
        </div>
      </div>
      <svg
        className="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
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
          fill="url(#98663e4b-de6d-4c3f-8d64-b9761d1534cc)"
        />
      </svg>
      <div
        className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
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
  );
}
