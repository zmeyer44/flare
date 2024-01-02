"use client";

import { useEffect, useState, useRef, ReactNode } from "react";
import Link from "next/link";
import { RiCloseFill, RiPlayMiniFill, RiPauseMiniFill } from "react-icons/ri";
import { usePlayer } from "@/app/_providers/pipPlayer";
import useProfile from "@/lib/hooks/useProfile";
import { getNameToShow, stopPropagation } from "@/lib/utils";
import { nip19 } from "nostr-tools";
import {
  MediaPlayer,
  MediaProvider,
  Poster,
  useMediaState,
  type MediaPlayerInstance,
} from "@vidstack/react";
import { useRouter } from "next/navigation";

export default function MiniMobilePlayer() {
  const useplayer = usePlayer();
  const { player, episode, currentTime: _currentTime, showPip } = useplayer;

  function handleClickHide() {
    useplayer?.pause();
    useplayer?.clear();
  }
  if (!showPip || !episode) {
    return null;
  }

  return (
    <div className="standalone-show fixed inset-x-0 bottom-[var(--bottom-nav-height)] hidden overflow-hidden bg-card @container">
      <Player episode={episode} player={player} onClose={handleClickHide} />
    </div>
  );
}

function Player({
  player: _,
  episode,
  onClose,
}: {
  player: React.RefObject<MediaPlayerInstance>;
  episode: {
    url: string;
    title?: string;
    thumbnail?: string;
    author: string;
    encodedEvent?: string;
  };
  onClose: () => void;
}) {
  const router = useRouter();
  const { player, currentTime, wasPlaying } = usePlayer();
  const { profile } = useProfile(episode.author);
  console.log("Redering, Player");
  const pipRef = useRef<MediaPlayerInstance>(player.current);
  useEffect(() => {
    console.log("Pip effect", player.current?.currentTime);
    // pipRef.current?.startLoading();
    console.log("VS", pipRef.current?.currentTime);
    console.log("VS", currentTime);
  }, [player.current]);
  const paused = useMediaState("paused", pipRef);
  function handleClickHide() {
    onClose();
  }
  let ActionIcon = !paused ? RiPauseMiniFill : RiPlayMiniFill;
  console.log("Was playing", wasPlaying);
  return (
    <>
      <Link
        href={episode.encodedEvent ? `/w/${episode.encodedEvent}` : "/"}
        className="flex w-full items-stretch justify-between gap-3 overflow-hidden hover:cursor-pointer sm:hidden"
      >
        <div className="flex shrink grow items-center gap-x-2 text-sm font-medium text-foreground">
          <div className="center aspect-[21/9] h-[55px] shrink-0 shadow">
            <div className="center h-full w-full">
              <MediaPlayer
                className="bg-muted-background group relative h-auto w-full overflow-hidden object-cover font-sans text-foreground ring-media-focus @container data-[focus]:ring-4"
                title={episode.title}
                src={episode.url}
                playsinline
                currentTime={currentTime}
                // autoplay={wasPlaying}
                ref={pipRef}
                onCanPlay={() => {
                  if (wasPlaying && pipRef.current?.paused) {
                    pipRef.current?.play();
                  }
                }}
                onError={(err) => {
                  alert("Error");
                  console.log("ERROR", err);
                }}
              >
                <MediaProvider>
                  {!!episode.thumbnail && (
                    <Poster
                      className="absolute inset-0 block h-full w-full rounded-lg border-0 object-cover opacity-0 outline-none ring-0 transition-opacity data-[visible]:opacity-100"
                      src={episode.thumbnail}
                      alt={episode.title ?? "video"}
                    />
                  )}
                </MediaProvider>
              </MediaPlayer>
            </div>
          </div>
          <div className="pr-1">
            <h3 className="line-clamp-1 font-semibold">
              {episode?.title ?? ""}
            </h3>
            <div
              className="flex"
              onClick={(e) => {
                stopPropagation(e);
                router.push(`/channel/${nip19.npubEncode(episode.author)}`);
              }}
            >
              <p className="line-clamp-1 text-xs text-muted-foreground hover:underline">
                {getNameToShow({
                  npub: nip19.npubEncode(episode.author),
                  profile,
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="min-w-auto flex aspect-[2/1] h-[55px] shrink-0 items-stretch justify-end overflow-hidden">
          <button
            onClick={(e) => {
              stopPropagation(e);
              if (paused) {
                pipRef.current?.play();
              } else {
                pipRef.current?.pause();
              }
            }}
            className="center aspect-square text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            <ActionIcon className="h-[30px] w-[30px]" />
          </button>
          <button
            onClick={(e) => {
              stopPropagation(e);
              handleClickHide();
            }}
            className="center aspect-square text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            <RiCloseFill className="h-[30px] w-[30px]" />
          </button>
        </div>
      </Link>
      <ProgressBar player={pipRef} />
    </>
  );
}
function ProgressBar({
  player,
}: {
  player: React.RefObject<MediaPlayerInstance>;
}) {
  const [progress, setProgress] = useState<number>(0);
  const time = useMediaState("currentTime", player),
    duration = useMediaState("duration", player);

  useEffect(() => {
    setProgress((time / duration) * 100);
  }, [time, duration]);

  return (
    <div className="flex h-[2px] w-full items-stretch justify-start bg-muted">
      <div
        className="bg-primary"
        style={{
          width: `${Math.floor(progress)}%`,
        }}
      />
    </div>
  );
}
