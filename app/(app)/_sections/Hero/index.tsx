import VideoPlayer from "@/components/videoPlayer";

export default function HeroSection() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-x-4 gap-y-5 px-5 pb-10 md:flex-row md:pb-20">
      <div className="flex-1 md:px-6">
        <h1 className="font-monomaniac mt-14 text-6xl  text-foreground sm:mt-10 lg:text-7xl">
          Welcome to Flare, Lets Change the web
        </h1>
      </div>
      <div className="w-full max-w-[450px] shrink-0 pt-4 md:w-5/12 md:pt-6">
        <VideoPlayer
          src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/low.mp4"
          title="test"
        />
      </div>
    </div>
  );
}
