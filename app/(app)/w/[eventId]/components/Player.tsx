"use client";
import { useEffect, useState } from "react";
import Spinner from "@/components/spinner";
import VideoPlayer from "@/components/videoPlayer";
import useVideo from "@/lib/hooks/useVideo";
import { anonModeAtom } from "@/app/(app)/_layout/_components/CommandDialog";
import { useAtom } from "jotai";
import { usePlayer } from "@/app/_providers/pipPlayer";
import { cn } from "@/lib/utils";
import { nip19 } from "nostr-tools";

type PlayerProps = {
  url: string;
  title: string;
  image: string;
  eventIdentifier: string;
  encodedEvent: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Player({
  url,
  title,
  image,
  eventIdentifier,
  className: containerClassName,
  encodedEvent,
  ...containerProps
}: PlayerProps) {
  const [anon] = useAtom(anonModeAtom);
  const { addView } = useVideo({ eventIdentifier: eventIdentifier });

  const player = usePlayer({
    url: url,
    title,
    thumbnail: image,
    author: eventIdentifier.split(":")[1] ?? "",
    encodedEvent,
  });
  const autho = eventIdentifier.split(":")[1] ?? "";
  useEffect(() => {
    console.log("usePlayer", player);
  }, [player]);
  useEffect(() => {
    if (eventIdentifier && !anon) {
      addView();
    }
  }, [eventIdentifier]);

  function onCanPlay() {
    console.log("onCanPlay");
  }
  if (!url || !title) {
    return (
      <div
        {...containerProps}
        className={cn(
          "center relative aspect-video h-full w-full overflow-hidden bg-muted text-primary",
          containerClassName,
        )}
      >
        <Spinner />
      </div>
    );
  }
  return (
    <div {...containerProps} className={cn("aspect-video", containerClassName)}>
      <VideoPlayer
        encodedEvent={encodedEvent}
        onCanPlay={onCanPlay}
        src={url}
        title={title}
        thumbnail={image}
        persistentProgress={true}
      />
    </div>
  );
}
