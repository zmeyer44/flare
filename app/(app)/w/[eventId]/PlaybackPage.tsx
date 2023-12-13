"use client";
import { Button } from "@/components/ui/button";
import Player from "./components/Player";
import VideoActions from "./components/VideoActions";
import VerticalVideosFeed from "@/containers/feeds/VerticalVideosFeed";
import CommentSection from "./components/Comments";
import { nip19 } from "nostr-tools";
import type { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import useProfile from "@/lib/hooks/useProfile";
import { getTagValues } from "@/lib/nostr/utils";

export default function PlaybackPage({ event }: { event: NDKEvent }) {
  const tagId = event.tagId();
  const npub = event.author.npub;
  const { profile } = useProfile(event.author.pubkey);
  const url = getTagValues("url", event.tags) as string;
  const title = getTagValues("title", event.tags) as string;
  const image = getTagValues("image", event.tags) as string;
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="shrink-1 flex-1 md:min-w-[500px]">
        {/* Video Player */}
        <div className="w-full rounded-xl">
          <Player url={url} title={title} image={image} />
        </div>
        <div className="pt-1">
          <VideoActions event={event} />
        </div>
        <CommentSection eventReference={tagId} />
      </div>
      <VerticalVideosFeed
        className="w-full lg:max-w-[400px]"
        title="Up Next"
        action={
          <Button className="" size={"sm"} variant={"ghost"}>
            View more
          </Button>
        }
        filter={{
          kinds: [34235 as NDKKind],
          limit: 5,
        }}
      />
    </div>
  );
}