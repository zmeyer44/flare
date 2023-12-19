"use client";
import { useEffect, useState } from "react";
import Spinner from "@/components/spinner";
import VideoPlayer from "@/components/videoPlayer";
import useVideo from "@/lib/hooks/useVideo";

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
  const { addView } = useVideo({ eventIdentifier: eventIdentifier });
  useEffect(() => {
    if (eventIdentifier) {
      addView();
    }
  }, [eventIdentifier]);
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
