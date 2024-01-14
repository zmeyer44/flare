"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AspectRatio } from "../ui/aspect-ratio";
import { Button } from "../ui/button";
import { IoPlay } from "react-icons/io5";
import { RiAddFill } from "react-icons/ri";
import Link from "next/link";
import useEvents from "@/lib/hooks/useEvents";
import type { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { getTagValues, getTagsValues } from "@/lib/nostr/utils";
import { nip19 } from "nostr-tools";
import { Skeleton } from "../ui/skeleton";

const zIndexes = ["z-50", "z-40", "z-30", "z-20", "z-10", "z-0"];

type StackedPlaylistCardProps = {
  playlist: NDKEvent;
  thumbnailCardClassName?: string;
  maxCards?: number;
  hideEmpty?: boolean;
  onAdd?: () => void;
};
export default function StackedPlaylistCard({
  playlist,
  thumbnailCardClassName,
  maxCards = 4,
  hideEmpty = false,
  onAdd,
}: StackedPlaylistCardProps) {
  const { currentUser } = useCurrentUser();
  const videoEvents = getTagsValues("a", playlist.tags);
  const videoEventIdentifiers = videoEvents
    .filter(Boolean)
    .map((e) => {
      if (e.includes(":") && e.split(":").length === 3) {
        const [kind, pubkey, identifier] = e.split(":") as [
          string,
          string,
          string,
        ];
        return {
          type: "naddr",
          data: {
            kind,
            pubkey,
            identifier,
          },
        };
      } else if (nip19.BECH32_REGEX.test(e)) {
        return nip19.decode(e);
      } else return;
    })
    .filter(Boolean)
    .filter(({ type }) => type === "naddr")
    .map((e) => e.data as nip19.AddressPointer);
  const { events, isLoading: videosLoading } = useEvents({
    filter: {
      kinds: videoEventIdentifiers.map((k) => k.kind),
      authors: videoEventIdentifiers.map((k) => k.pubkey),
      ["#d"]: videoEventIdentifiers.map((k) => k.identifier),
    },
  });
  const processedEvents = events
    .filter((e) => getTagValues("thumb", e.tags))
    .slice(0, maxCards - 1);
  const title =
    getTagValues("title", playlist.tags) ??
    (getTagValues("name", playlist.tags) as string);

  const showAddOption = currentUser?.pubkey === playlist.pubkey && !!onAdd;
  if (hideEmpty && !videosLoading && processedEvents.length === 0) {
    return null;
  }

  return (
    <div className="flex-1 overflow-x-visible">
      <div className="mb-2 flex w-full items-center overflow-hidden">
        <h2 className="truncate text-base font-semibold">{title}</h2>
      </div>
      <div className="isolate flex items-end justify-start -space-x-2 pb-2">
        {videosLoading ? (
          <LoadingVideos
            thumbnailCardClassName={thumbnailCardClassName}
            maxCards={maxCards}
          />
        ) : processedEvents.length ? (
          processedEvents.map((e, idx) => (
            <Link
              href={`/w/${e.encode()}`}
              key={e.id}
              className={cn(
                zIndexes[idx],
                "group relative flex w-full max-w-[100px] items-center transition-all hover:max-w-[180px]",
                (idx === 0 || (idx === events.length - 1 && !showAddOption)) &&
                  "hover:max-w-[140px]",
                thumbnailCardClassName,
              )}
            >
              {idx !== 0 && (
                <div className="h-[100px] w-[40px] max-w-[40px] flex-2"></div>
              )}
              <div className="center relative h-full w-[100px] transform overflow-hidden rounded-lg object-cover shadow-[0_0_#0000004d,_0_9px_20px_#0000004a,_0_37px_37px_#00000042] transition-all group-hover:-translate-y-2 group-hover:scale-110 group-hover:shadow-[0_0_#0000004d,_0_9px_20px_#0000004a,_0_37px_37px_#00000042,_0_10px_50px_#00000026] group-hover:shadow-muted/50">
                <AspectRatio ratio={3 / 4}>
                  <Image
                    alt="Image"
                    height="288"
                    width="288"
                    unoptimized
                    src={getTagValues("thumb", e.tags)!}
                    className={cn(
                      "aspect-[3/4] h-full object-cover object-center",
                    )}
                  />
                </AspectRatio>
                <div className="absolute bottom-0 right-0 pb-2 pr-2">
                  <Button
                    //   onClick={() => setOpen(true)}
                    variant="default"
                    size="icon"
                    className={cn(
                      "center relative h-6 w-6 rounded-full text-foreground opacity-50 transition-all group-hover:scale-110 group-hover:opacity-70 group-hover:hover:opacity-100",
                    )}
                  >
                    <IoPlay className="h-[14px] w-[14px] text-foreground" />
                  </Button>
                </div>
              </div>
              {(idx !== events.length - 1 || showAddOption) && (
                <div className="h-[100px] w-[40px] max-w-[40px] flex-2"></div>
              )}
            </Link>
          ))
        ) : (
          <div className="center py-2 text-muted-foreground">
            <p className="text-sm">No videos yet</p>
          </div>
        )}
        {showAddOption && (
          <button
            onClick={() => onAdd()}
            className="center aspect-[3/4] w-full max-w-[100px] rounded-lg bg-muted transition-all hover:bg-muted/60"
          >
            <Button
              asChild
              variant="default"
              size="icon"
              className={cn(
                "center relative h-10 w-10 rounded-full text-foreground",
              )}
            >
              <RiAddFill className="h-[24px] w-[24px] text-foreground" />
            </Button>
          </button>
        )}
      </div>
    </div>
  );
}
export function LoadingStackedPlaylistCard({
  thumbnailCardClassName,
  maxCards = 4,
}: Omit<StackedPlaylistCardProps, "playlist">) {
  return (
    <div className="pointer-events-none overflow-visible overflow-x-hidden">
      <div className="flex items-center">
        <h2 className="text-base font-semibold">
          <Skeleton className="mb-2 h-[18px] w-[100px] bg-muted" />
        </h2>
      </div>
      <LoadingVideos
        thumbnailCardClassName={thumbnailCardClassName}
        maxCards={maxCards}
      />
    </div>
  );
}

function LoadingVideos({
  thumbnailCardClassName,
  maxCards = 4,
}: Omit<StackedPlaylistCardProps, "playlist">) {
  const dummyEvents = Array(maxCards).fill("");

  return (
    <div className="pointer-events-none isolate flex items-end justify-start -space-x-2 pb-2">
      {dummyEvents.map((e, idx) => (
        <div
          key={idx}
          className={cn(
            zIndexes[idx],
            "group relative flex w-full max-w-[100px] items-center transition-all hover:max-w-[200px]",
            (idx === 0 || idx === dummyEvents.length - 1) &&
              "hover:max-w-[150px]",
            thumbnailCardClassName,
          )}
        >
          {idx !== 0 && <div className="h-[100px] max-w-[50px] flex-2"></div>}
          <div className="center relative h-full w-[100px] transform overflow-hidden rounded-lg object-cover shadow-[0_0_#0000004d,_0_9px_20px_#0000004a,_0_37px_37px_#00000042] transition-all group-hover:-translate-y-2 group-hover:scale-110 group-hover:shadow-[0_0_#0000004d,_0_9px_20px_#0000004a,_0_37px_37px_#00000042,_0_10px_50px_#00000026] group-hover:shadow-muted/50">
            <AspectRatio ratio={3 / 4} className="">
              <Skeleton className="h-full w-full bg-muted" />
            </AspectRatio>
            <div className="absolute bottom-0 right-0 pb-2 pr-2 ">
              <Button
                //   onClick={() => setOpen(true)}
                variant="default"
                size="icon"
                className={cn(
                  "center relative h-6 w-6 rounded-full text-foreground opacity-50 transition-all group-hover:scale-110 group-hover:opacity-70 group-hover:hover:opacity-100",
                )}
              >
                <IoPlay className="h-[14px] w-[14px] text-foreground" />
              </Button>
            </div>
          </div>
          {idx !== dummyEvents.length - 1 && (
            <div className="h-[100px] max-w-[50px] flex-3"></div>
          )}
        </div>
      ))}
    </div>
  );
}
