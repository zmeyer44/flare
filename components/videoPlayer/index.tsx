"use client";
import "@vidstack/react/player/styles/base.css";

import { useEffect } from "react";

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
import { usePlayer } from "@/app/_providers/pipPlayer";

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
  persistentProgress?: boolean;
  encodedEvent?: string;
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
  persistentProgress,
  encodedEvent,
}: VideoPlayerProps) {
  const useplayer = usePlayer({
    url: src,
    author: "",
    title,
    thumbnail,
    encodedEvent,
  });
  const { player, updateCurrentTime } = useplayer;
  // let player = useRef<MediaPlayerInstance>(null);
  useEffect(() => {
    // Subscribe to state updates.

    return player.current!.subscribe(
      ({ paused, viewType, currentTime: currentTimeInSeconds }) => {
        // console.log("currentTimeInSeconds", currentTimeInSeconds);
        if (recordView) {
          if (currentTimeInSeconds - (lastRecordedTime ?? 0) > 10) {
            recordView(currentTimeInSeconds);
          }
        }

        // console.log('is paused?', '->', state.paused);
        // console.log('is audio view?', '->', state.viewType === 'audio');
      },
    );
  }, []);

  // const time = useMediaState("currentTime", player);
  // const paused = useMediaState("paused", player);
  // useInterval(() => {
  //   logProgress({ currentTime: time, playing: !paused });
  // }, 5000);
  // console.log("Renderererer");
  // function logProgress({
  //   currentTime,
  //   playing,
  // }: {
  //   currentTime: number;
  //   playing: boolean;
  // }) {
  //   console.log(
  //     JSON.stringify({
  //       currentTime: currentTime,
  //       playing: playing,
  //     }),
  //   );
  //   return;
  //   localStorage.setItem(
  //     "currently-watching",
  //     JSON.stringify({
  //       currentTime: currentTime,
  //       playing: playing,
  //     }),
  //   );
  // }

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
      onPause={() => {
        useplayer.pause();
      }}
      onPlay={() => {
        useplayer.play();
      }}
      // onTimeUpdate={(event) => {
      //   updateCurrentTime(Math.floor(event.currentTime));
      // }}
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
      <VideoLayout persistentProgress={persistentProgress} />
    </MediaPlayer>
  );
}
