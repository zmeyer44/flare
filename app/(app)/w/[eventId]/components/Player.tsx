"use client";
import { useEffect, useState } from "react";
import { useNDK } from "@/app/_providers/ndk";
import Spinner from "@/components/spinner";
import VideoPlayer from "@/components/videoPlayer";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { createEvent } from "@/lib/actions/create";
import type { NDKKind } from "@nostr-dev-kit/ndk";

export default function Player({
  url,
  title,
  image,
  eventIdentifier,
}: {
  url: string;
  title: string;
  image: string;
  eventIdentifier: string;
}) {
  const [requestingView, setRequestingView] = useState(false);
  const { ndk } = useNDK();
  const { currentUser } = useCurrentUser();
  useEffect(() => {
    if (ndk && currentUser && url && !requestingView) {
      setRequestingView(true);
      handleRecordView();
    }
  }, [url, currentUser, ndk]);

  async function handleRecordView() {
    if (!ndk || !currentUser) return;
    try {
      const viewEvent = await ndk.fetchEvent({
        authors: [currentUser.pubkey],
        kinds: [34237 as NDKKind],
        ["#a"]: [eventIdentifier],
      });
      if (!viewEvent) {
        await createEvent(ndk, {
          content: "",
          kind: 34237,
          tags: [
            ["a", eventIdentifier],
            ["d", eventIdentifier],
            ["viewed", "0"],
          ],
        });
      }
    } catch (err) {
      console.log("Error recoring view");
    }
  }
  if (!url || !title) {
    return (
      <div className="center relative aspect-video h-full w-full overflow-hidden rounded-md bg-muted text-primary">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="aspect-video">
      <VideoPlayer src={url} title={title} thumbnail={image} />
    </div>
  );
}
