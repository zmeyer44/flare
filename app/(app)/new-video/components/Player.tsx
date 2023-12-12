"use client";
import { useState } from "react";

import Spinner from "@/components/spinner";
import VideoPlayer from "@/components/videoPlayer";
import { RiUploadCloud2Line } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RiSearchLine } from "react-icons/ri";

import { nip19 } from "nostr-tools";

import { useNDK } from "@/app/_providers/ndk";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { toast } from "sonner";
import { useModal } from "@/app/_providers/modal/provider";
import type { NDKEvent } from "@nostr-dev-kit/ndk";
import UploadModal from "@/components/modals/upload";
import { createEvent } from "@/lib/actions/create";
import { getTagValues } from "@/lib/nostr/utils";

export default function Player({
  url,
  title,
  image,
}: {
  url: string;
  title?: string;
  image?: string;
}) {
  if (!url) {
    return (
      <div className="center relative aspect-video h-full w-full overflow-hidden rounded-md bg-muted text-primary">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="">
      <VideoPlayer src={url} title={title ?? "Untitled"} thumbnail={image} />
    </div>
  );
}

export function VideoUpload({
  setVideo,
}: {
  setVideo: (video: {
    url: string;
    title?: string;
    summary?: string;
    thumbnail?: string;
    fileType?: string;
    fileHash?: string;
  }) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showEventInput, setShowEventInput] = useState(false);
  const [eventTagId, setEventTagId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const { fetchEvents, ndk } = useNDK();
  const modal = useModal();
  const { currentUser } = useCurrentUser();

  async function handleSearch() {
    if (!eventTagId) return;
    const { data, type } = nip19.decode(eventTagId);
    if (type !== "naddr") {
      return;
    }
    setIsSearching(true);
    try {
      const events = await fetchEvents({
        kinds: [data.kind],
        authors: [data.pubkey],
        ["#d"]: [data.identifier],
        limit: 1,
      });
      console.log("Events found", events);
      if (events.length && events[0]) {
        const url = getTagValues("url", events[0].tags);
        if (!url) return alert("Invalid event");
        const title = getTagValues("url", events[0].tags);
        const summary =
          getTagValues("summary", events[0].tags) ?? events[0].content;
        const thumbnail =
          getTagValues("thumb", events[0].tags) ??
          getTagValues("image", events[0].tags);
        const fileType = getTagValues("m", events[0].tags);
        const fileHash = getTagValues("x", events[0].tags);
        setVideo({
          url,
          title,
          summary,
          thumbnail,
          fileType,
          fileHash,
        });
      }
    } catch (err) {
      console.log("Error searching", err);
    } finally {
      setIsSearching(false);
    }
  }

  if (showEventInput) {
    return (
      <div className="center relative aspect-video h-full w-full flex-col gap-y-2 overflow-hidden rounded-md bg-muted">
        <div className="mx-auto w-full max-w-[300px] rounded-lg bg-background/40 px-3 py-3">
          <Label>Kind 1063 event</Label>
          <div className="flex gap-2">
            <Input
              value={eventTagId}
              onChange={(e) => setEventTagId(e.target.value)}
              placeholder={"naddr1..."}
            />
            <Button
              onClick={handleSearch}
              loading={isSearching}
              disabled={isSearching}
              size="icon"
              className="shrink-0"
            >
              <RiSearchLine className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="center">or</div>
        <div className="mx-auto w-full max-w-[300px] rounded-lg bg-background/40 px-3 py-3">
          <Label>Video Url</Label>
          <div className="flex gap-2">
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder={"https://..."}
            />
            <Button
              onClick={() => setVideo({ url: videoUrl })}
              loading={isSearching}
              disabled={isSearching}
              size="icon"
              className="shrink-0"
            >
              <RiSearchLine className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <Button onClick={() => setShowEventInput(false)} variant={"ghost"}>
          Back
        </Button>
      </div>
    );
  }
  return (
    <div className="center relative aspect-video h-full w-full flex-col gap-y-3 overflow-hidden rounded-md bg-muted">
      <button
        onClick={() =>
          modal?.show(
            <UploadModal
              accept="video/*"
              folderName="video"
              generateThumbnail={true}
              onSumbit={(fileUrl, fileType, fileHash, thumbnailUrl) =>
                setVideo({
                  url: fileUrl,
                  thumbnail: thumbnailUrl,
                  fileHash,
                  fileType,
                })
              }
            />,
          )
        }
        className="mt-2 flex w-full max-w-[300px] justify-center rounded-lg border border-dashed border-foreground/25 px-6 py-10 hover:bg-background/40"
      >
        <div className="text-center">
          <RiUploadCloud2Line
            className="mx-auto h-12 w-12 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
            <span className="relative rounded-md font-semibold text-foreground focus-within:outline-none">
              Upload a file
            </span>
          </div>
          <p className="text-xs leading-5 text-muted-foreground">Max 100MB</p>
        </div>
      </button>

      <Button onClick={() => setShowEventInput(true)} variant={"ghost"}>
        Or, enter existing event
      </Button>
    </div>
  );
}
