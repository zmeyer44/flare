import { useEffect, useState } from "react";

import * as Slider from "@radix-ui/react-slider";
import {
  formatTime,
  Thumbnail,
  useMediaRemote,
  useMediaState,
  useSliderPreview,
} from "@vidstack/react";

export function Volume() {
  const volume = useMediaState("volume"),
    canSetVolume = useMediaState("canSetVolume"),
    remote = useMediaRemote();

  if (!canSetVolume) return null;

  return (
    <Slider.Root
      className="group relative inline-flex h-10 w-full max-w-[80px] cursor-pointer touch-none select-none items-center outline-none"
      value={[volume * 100]}
      onValueChange={([value]) => {
        remote.changeVolume((value ?? 0) / 100);
      }}
    >
      <Slider.Track className="relative h-[5px] w-full rounded-sm bg-white/30">
        <Slider.Range className="absolute h-full rounded-sm bg-media-brand will-change-[width]" />
      </Slider.Track>
      <Slider.Thumb
        aria-label="Volume"
        className="block h-[15px] w-[15px] rounded-full border border-[#cacaca] bg-white opacity-0 outline-none ring-white/40 transition-opacity will-change-[left] focus:opacity-100 focus:ring-4 group-hocus:opacity-100"
      />
    </Slider.Root>
  );
}

export interface TimeSliderProps {
  thumbnails?: string;
}

export function Time({ thumbnails }: TimeSliderProps) {
  const time = useMediaState("currentTime"),
    canSeek = useMediaState("canSeek"),
    duration = useMediaState("duration"),
    seeking = useMediaState("seeking"),
    remote = useMediaRemote(),
    step = (1 / duration) * 100,
    [value, setValue] = useState(0),
    { previewRootRef, previewRef, previewValue } = useSliderPreview({
      clamp: true,
      offset: 6,
      orientation: "horizontal",
    }),
    previewTime = (previewValue / 100) * duration;

  // Keep slider value in-sync with playback.
  useEffect(() => {
    if (seeking) return;
    setValue((time / duration) * 100);
  }, [time, duration]);

  return (
    <Slider.Root
      className="group relative inline-flex h-9 w-full cursor-pointer touch-none select-none items-center outline-none"
      value={[value]}
      disabled={!canSeek}
      step={Number.isFinite(step) ? step : 1}
      ref={previewRootRef}
      onValueChange={([value]) => {
        setValue(value ?? 0);
        remote.seeking(((value ?? 0) / 100) * duration);
      }}
      onValueCommit={([value]) => {
        remote.seek(((value ?? 0) / 100) * duration);
      }}
    >
      <Slider.Track className="relative h-[5px] w-full rounded-sm bg-white/30">
        <Slider.Range className="absolute h-full rounded-sm bg-media-brand will-change-[width]" />
      </Slider.Track>

      <Slider.Thumb
        aria-label="Current Time"
        className="block h-[15px] w-[15px] rounded-full border border-[#cacaca] bg-white opacity-0 outline-none ring-white/40 transition-opacity will-change-[left] focus:opacity-100 focus:ring-4 group-hocus:opacity-100"
      />

      {/* Preview */}
      <div
        className="absolute flex flex-col items-center opacity-0 transition-opacity duration-200 will-change-[left] data-[visible]:opacity-100"
        ref={previewRef}
      >
        {thumbnails ? (
          <Thumbnail.Root
            src={thumbnails}
            time={previewTime}
            className="mb-2 block h-[var(--thumbnail-height)] max-h-[160px] min-h-[80px] w-[var(--thumbnail-width)] min-w-[120px] max-w-[180px] overflow-hidden border border-white bg-black"
          >
            <Thumbnail.Img />
          </Thumbnail.Root>
        ) : null}
        <span className="text-[13px]">{formatTime(previewTime)}</span>
      </div>
    </Slider.Root>
  );
}

export function PersistentProgress({ thumbnails }: TimeSliderProps) {
  const time = useMediaState("currentTime"),
    canSeek = useMediaState("canSeek"),
    duration = useMediaState("duration"),
    seeking = useMediaState("seeking"),
    remote = useMediaRemote(),
    step = (1 / duration) * 100,
    [value, setValue] = useState(0),
    { previewRootRef, previewRef, previewValue } = useSliderPreview({
      clamp: true,
      offset: 6,
      orientation: "horizontal",
    }),
    previewTime = (previewValue / 100) * duration;

  // Keep slider value in-sync with playback.
  useEffect(() => {
    if (seeking) return;
    setValue((time / duration) * 100);
  }, [time, duration]);
  return (
    <Slider.Root
      className="group relative inline-flex h-[4px] w-full cursor-pointer touch-none select-none items-center outline-none"
      value={[value]}
      disabled={!canSeek}
      step={Number.isFinite(step) ? step : 1}
      ref={previewRootRef}
      onValueChange={([value]) => {
        setValue(value ?? 0);
        remote.seeking(((value ?? 0) / 100) * duration);
      }}
      onValueCommit={([value]) => {
        remote.seek(((value ?? 0) / 100) * duration);
      }}
    >
      <Slider.Track className="relative h-full w-full rounded-sm bg-muted-foreground/80">
        <Slider.Range className="absolute h-full rounded-sm bg-media-brand will-change-[width]" />
      </Slider.Track>
      <Slider.Thumb
        aria-label="Current Time"
        className="block h-[10px] w-[10px] rounded-full border border-primary bg-primary opacity-0 outline-none transition-opacity will-change-[left] focus:opacity-100 focus:ring-4 group-hocus:opacity-100"
      />

      {/* Preview */}
      <div
        className="absolute flex flex-col items-center opacity-0 transition-opacity duration-200 will-change-[left] data-[visible]:opacity-100"
        ref={previewRef}
      >
        {thumbnails ? (
          <Thumbnail.Root
            src={thumbnails}
            time={previewTime}
            className="block h-[var(--thumbnail-height)] max-h-[160px] min-h-[80px] w-[var(--thumbnail-width)] min-w-[120px] max-w-[180px] overflow-hidden border border-white bg-black"
          >
            <Thumbnail.Img />
          </Thumbnail.Root>
        ) : null}
        <span className="text-[13px]">{formatTime(previewTime)}</span>
      </div>
    </Slider.Root>
  );
}
