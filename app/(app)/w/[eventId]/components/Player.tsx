"use client";
import { useEffect, useState } from "react";
import Spinner from "@/components/spinner";
import VideoPlayer from "@/components/videoPlayer";
import useVideo from "@/lib/hooks/useVideo";
import { anonModeAtom } from "@/app/(app)/_layout/_components/CommandDialog";
import { useAtom } from "jotai";
import { usePlayer } from "@/app/_providers/pipPlayer";

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
  const [anon] = useAtom(anonModeAtom);
  const { addView } = useVideo({ eventIdentifier: eventIdentifier });

  const player = usePlayer({
    url: url,
    title,
    thumbnail: image,
    author: eventIdentifier.split(":")[1] ?? "",
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
      <div className="center relative aspect-video h-full w-full overflow-hidden rounded-md bg-muted text-primary">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="aspect-video">
      <VideoPlayer
        onCanPlay={onCanPlay}
        src={url}
        title={title}
        thumbnail={image}
      />
    </div>
  );
}
