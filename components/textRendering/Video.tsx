import { cn } from "@/lib/utils";
import VideoPlayer from "@/components/videoPlayer";
export default function VideoUrl({
  url,
  className,
}: {
  url: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative max-h-[300px] overflow-hidden rounded-xl",
        className,
      )}
    >
      <VideoPlayer src={url} title={"event video"} />
    </div>
  );
}
