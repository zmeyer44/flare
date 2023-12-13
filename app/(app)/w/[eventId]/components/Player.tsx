"use client";
import Spinner from "@/components/spinner";
import VideoPlayer from "@/components/videoPlayer";
export default function Player({
  url,
  title,
  image,
}: {
  url: string;
  title: string;
  image: string;
}) {
  if (!url || !title) {
    return (
      <div className="center relative aspect-video h-full w-full overflow-hidden rounded-md bg-muted text-primary">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="aspect-video bg-red-400">
      <VideoPlayer src={url} title={title} thumbnail={image} />
    </div>
  );
}
