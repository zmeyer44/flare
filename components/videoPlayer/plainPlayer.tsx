"use client";
import "@vidstack/react/player/styles/base.css";

import { useRef } from "react";

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
  useMediaState,
} from "@vidstack/react";
import { VideoLayout } from "./layout";

import { type TrackType } from "./types";

type VideoPlayerProps = {
  textTracks?: TrackType[];
  src: string;
  title: string;
  thumbnail?: string;
  alt?: string;
  autoplay?: boolean;
  recordView?: (timeInSeconds: number) => void;
  lastRecordedTime?: number;
  onCanPlay?: () => void;
};
export default function VideoPlayer({
  textTracks,
  src,
  title,
  thumbnail,
  alt,
  autoplay = false,
  recordView,
  lastRecordedTime,
  onCanPlay: _onCanPlay,
}: VideoPlayerProps) {
  //   const { player, updateCurrentTime } = useplayer;
  let player = useRef<MediaPlayerInstance>(null);

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
    if (_onCanPlay) {
      _onCanPlay();
    }
    // ...
  }

  return (
    <MediaPlayer
      className="bg-muted-background group relative aspect-video h-auto w-full overflow-hidden font-sans text-foreground ring-media-focus @container data-[focus]:ring-4"
      title={title}
      src={src}
      playsinline
      onProviderChange={onProviderChange}
      onCanPlay={onCanPlay}
      ref={player}
      autoplay={autoplay}
    >
      <MediaProvider>
        {!!thumbnail && (
          <Poster
            className="absolute inset-0 block h-full w-full border-0 object-cover opacity-0 outline-none ring-0 transition-opacity data-[visible]:opacity-100"
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
