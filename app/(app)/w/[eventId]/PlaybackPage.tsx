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
import { useEvent } from "@/lib/hooks/useEvents";
import LoadingPage from "./loading";

export default function Page({
  identifier,
  kind,
  pubkey,
}: {
  identifier: string;
  kind: number;
  pubkey: string;
}) {
  const { event, isLoading } = useEvent({
    filter: {
      kinds: [kind],
      authors: [pubkey],
      ["#d"]: [identifier],
    },
  });
  if (isLoading || !event) {
    return <LoadingPage />;
  }

  return <PlaybackPage event={event} />;
}

export function PlaybackPage({ event }: { event: NDKEvent }) {
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
        <div className="sticky top-[calc(var(--header-height))] z-30 aspect-video w-full overflow-hidden sm:static sm:max-h-[calc(61vw-32px)] sm:rounded-xl sm:px-4">
          <Player
            className="overflow-hidden sm:rounded-xl"
            url={url}
            title={title}
            image={image}
            eventIdentifier={event.tagId()}
          />
        </div>
        <div className="px-4">
          <div className="pt-1">
            <VideoActions event={event} />
          </div>
          <CommentSection
            eventReference={tagId}
            eventId={event.id}
            pubkey={event.pubkey}
          />
        </div>
      </div>
      <VerticalVideosFeed
        className="w-full px-4 lg:max-w-[400px]"
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
        secondaryFilter={(_, i) => i < 10}
      />
    </div>
  );
}
