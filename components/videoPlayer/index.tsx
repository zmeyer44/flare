"use client";
import "@vidstack/react/player/styles/base.css";

import { useEffect, useRef } from "react";

import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Poster,
  Track,
  type MediaCanPlayDetail,
  type MediaCanPlayEvent,
  type MediaPlayerInstance,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
} from "@vidstack/react";
import { VideoLayout } from "./layout";

import { type TrackType } from "./types";

type VideoPlayerProps = {
  textTracks?: TrackType[];
  src: string;
  title: string;
  thumbnail?: string;
  alt?: string;
};
export default function VideoPlayer({
  textTracks,
  src,
  title,
  thumbnail,
  alt,
}: VideoPlayerProps) {
  let player = useRef<MediaPlayerInstance>(null);

  useEffect(() => {
    // Subscribe to state updates.
    return player.current!.subscribe(({ paused, viewType }) => {
      // console.log('is paused?', '->', state.paused);
      // console.log('is audio view?', '->', state.viewType === 'audio');
    });
  }, []);

  function onProviderChange(
    provider: MediaProviderAdapter | null,
    nativeEvent: MediaProviderChangeEvent,
  ) {
    // We can configure provider's here.
    if (isHLSProvider(provider)) {
      provider.config = {};
    }
  }

  // We can listen for the `can-play` event to be notified when the player is ready.
  function onCanPlay(
    detail: MediaCanPlayDetail,
    nativeEvent: MediaCanPlayEvent,
  ) {
    // ...
  }

  return (
    <MediaPlayer
      className="bg-muted-background group relative aspect-video h-full w-full overflow-hidden rounded-md font-sans text-foreground ring-media-focus data-[focus]:ring-4"
      title={title}
      src={src}
      crossorigin
      playsinline
      onProviderChange={onProviderChange}
      onCanPlay={onCanPlay}
      ref={player}
    >
      <MediaProvider>
        {!!thumbnail && (
          <Poster
            className="absolute inset-0 block h-full w-full rounded-lg border-0 object-cover opacity-0 outline-none ring-0 transition-opacity data-[visible]:opacity-100"
            src={thumbnail}
            alt={alt ?? "video"}
          />
        )}
        {textTracks?.map((track) => <Track {...track} key={track.src} />)}
      </MediaProvider>
      {/* <VideoLayout thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt" /> */}
      <VideoLayout />
    </MediaPlayer>
  );
}
