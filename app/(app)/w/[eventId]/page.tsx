import HorizontalVideoCard from "@/components/cards/videoCard/horizontalCard";
import { Button } from "@/components/ui/button";
import Player from "./components/Player";
import VideoActions from "./components/VideoActions";
import VerticalVideosFeed from "@/containers/feeds/VerticalVideosFeed";
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
      <VerticalVideosFeed
        className="w-full lg:max-w-[400px]"
        title="Up Next"
        action={
          <Button className="" size={"sm"} variant={"ghost"}>
            View more
          </Button>
        }
      />
    </div>
  );
}
