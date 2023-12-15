import VideoPlayer from "@/components/videoPlayer";
import SupporterLabel from "./components/supporterLabel";

export default function HeroSection() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-x-4 gap-y-5 px-5 pb-10 md:flex-row md:pb-20">
      <div className="mt-14 flex-1 text-6xl font-semibold  sm:mt-10 md:px-6 md:text-6xl lg:text-7xl">
        <SupporterLabel
          sponsorName="Bitkey Wallet"
          href="https://bitkey.world?ref=flare"
          className="mb-2"
        />
        <h1 className="font-main text-foreground">Everything you need</h1>
        <span className="font-main mt-1.5 block text-primary">
          in one wallet
        </span>
      </div>
      <div className="max-h-[350px] w-full max-w-[450px] shrink-0 pt-4 md:mt-10 md:w-5/12 md:pt-6 lg:mt-20">
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
