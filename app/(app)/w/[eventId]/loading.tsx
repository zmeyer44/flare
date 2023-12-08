import { Skeleton } from "@/components/ui/skeleton";
import { VerticalVideosFeedLoading } from "@/containers/feeds/VerticalVideosFeed";
import { VideoActionsLoading } from "./components/VideoActions";
import { Button } from "@/components/ui/button";
export default function LoadingPage() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="shrink-1 flex-1 md:min-w-[500px]">
        {/* Video Player */}
        <div className="w-full rounded-xl">
          <Skeleton className="aspect-video w-full bg-muted" />
        </div>
        <div className="pt-1">
          <VideoActionsLoading />
        </div>
        {/* <CommentSection eventReference={tagId} /> */}
      </div>
      <VerticalVideosFeedLoading
        className="w-full lg:max-w-[400px]"
        title="Up Next"
        action={
          <Button disabled size={"sm"} variant={"ghost"}>
            View more
          </Button>
        }
        filter={{}}
      />
    </div>
  );
}
