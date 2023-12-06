import HorizontalVideoCard from "@/components/cards/videoCard/horizontalCard";
import { Button } from "@/components/ui/button";
import Player from "./components/Player";
import VideoActions from "./components/VideoActions";

export default function PlaybackPage({
  params: { eventId },
}: {
  params: {
    eventId: string;
  };
}) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="shrink-1 flex-1 md:min-w-[500px]">
        {/* Video Player */}
        <div className="w-full rounded-xl">
          <Player />
        </div>
        <div className="pt-1">
          <VideoActions />
        </div>
      </div>
      <div className="w-full lg:max-w-[400px]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Up Next</h2>
          <Button className="" size={"sm"} variant={"ghost"}>
            View more
          </Button>
        </div>
        <div className="py-3">
          <ul>
            <li>
              <HorizontalVideoCard />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
