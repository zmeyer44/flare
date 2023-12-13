import VideoPlayer from "@/components/videoPlayer";

export default function HeroSection() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-x-4 gap-y-5 px-5 pb-10 md:flex-row md:pb-20">
      <div className="flex-1 text-6xl font-semibold md:px-6 md:text-6xl lg:text-7xl">
        <h1 className="font-main mt-14 text-foreground  sm:mt-10 ">
          Everything you need
        </h1>
        <span className="font-main mt-1 block text-primary">in one wallet</span>
      </div>
      <div className="aspect-video max-h-[350px] w-full max-w-[450px] shrink-0 pt-4 md:w-5/12 md:pt-6">
        <VideoPlayer
          autoplay={false}
          src="https://www.youtube.com/watch?v=aHBGSlJW65w"
          title="Bitkey"
          thumbnail="https://www.nobsbitcoin.com/content/images/size/w2000/2023/12/bitkey-preorder.png"
        />
      </div>
    </div>
  );
}
