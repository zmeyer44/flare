"use client";
import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LikeToggleButton from "@/components/custom-buttons/LikeToggleButton";
import { cn, getTwoLetters, getNameToShow } from "@/lib/utils";
import { HiCheckBadge } from "react-icons/hi2";
import { RiMore2Fill } from "react-icons/ri";
import DropDownOptions from "@/components/custom-buttons/DropDownOptions";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { getTagValues } from "@/lib/nostr/utils";
import useProfile from "@/lib/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";

type VideoActionsProps = {
  event: NDKEvent;
};
export default function VideoActions({ event }: VideoActionsProps) {
  const npub = event.author.npub;
  const { profile } = useProfile(event.author.pubkey);
  console.log(event.rawEvent());
  const title = getTagValues("title", event.tags) as string;
  const summary =
    getTagValues("summary", event.tags) ??
    (getTagValues("about", event.tags) as string);

  const [likeCount, setLikeCount] = useState(0);
  return (
    <div className="space-y-2.5 py-2">
      {/* Title Section */}
      <div className="flex justify-between">
        <h1 className="text-[1.3rem] text-xl font-semibold">{title}</h1>
      </div>

      {/* Detials Section */}
      <div className="flex flex-wrap justify-between gap-y-3">
        {/* Channel */}
        <div className="flex items-center gap-5">
          {/* Channel Section */}
          <div className="flex">
            <Link
              href={`/${npub}`}
              className="center group gap-x-3 rounded-sm rounded-r-full pr-1 text-foreground hover:shadow"
            >
              <Avatar className="center h-[34px] w-[34px] overflow-hidden rounded-[.5rem] bg-muted sm:h-[40px] sm:w-[40px]">
                <AvatarImage
                  className="object-cover"
                  src={profile?.image}
                  alt={profile?.displayName}
                />
                <AvatarFallback className="text-[12px]">
                  {getTwoLetters({ npub, profile })}
                </AvatarFallback>
              </Avatar>
              <div className="">
                <div className="flex items-center gap-1">
                  <span className="truncate text-[14px] font-semibold sm:text-[16px]">
                    {getNameToShow({ npub, profile })}
                  </span>
                  {!!profile?.nip05 && (
                    <HiCheckBadge className="h-[12px] w-[12px] text-primary sm:h-[14px] sm:w-[14px]" />
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground sm:text-xs">
                  2.5k followers
                </p>
              </div>
            </Link>
          </div>
          {/* Channel Action Section */}
          <div className="flex items-center gap-2">
            <Button size={"sm"} className="px-4 font-bold">
              Follow
            </Button>
            <Button
              size={"sm"}
              className="px-4 font-bold"
              variant={"secondary"}
            >
              Zap
            </Button>
          </div>
        </div>
        {/* Video actions */}
        <div className="ml-auto flex items-center gap-3 text-muted-foreground">
          <LikeToggleButton
            likeCount={likeCount}
            onClick={(action) => {
              if (action === "+") {
                setLikeCount((prev) => prev + 1);
              } else {
                setLikeCount((prev) => prev - 1);
              }
            }}
          />
          <DropDownOptions />
        </div>
      </div>

      {/* Metadata Section */}
      <div
        className={cn(
          "rounded-xl bg-muted p-3",
          true && "cursor-pointer transition-all hover:bg-muted-foreground/30",
        )}
      >
        <div className="flex items-center gap-x-1.5 text-[13px] font-semibold text-foreground">
          <p>44,053 views</p> <span>•</span>
          <p>44,053 views</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>{summary}</p>
        </div>
        <button className="text-xs font-medium leading-none">
          <span>See more...</span>
        </button>
      </div>
    </div>
  );
}
export function VideoActionsLoading() {
  return (
    <div className="space-y-2.5 py-2">
      {/* Title Section */}
      <div className="my-3 flex justify-between">
        <Skeleton className="h-6 w-3/4 bg-muted" />
      </div>

      {/* Detials Section */}
      <div className="flex flex-wrap justify-between gap-y-3">
        {/* Channel */}
        <div className="flex items-center gap-5">
          {/* Channel Section */}
          <div className="flex">
            <div className="center group gap-x-3 rounded-sm rounded-r-full pr-1 text-foreground hover:shadow">
              <Avatar className="center h-[34px] w-[34px] overflow-hidden rounded-[.5rem] bg-muted sm:h-[40px] sm:w-[40px]">
                <AvatarFallback className="text-[12px]"></AvatarFallback>
              </Avatar>
              <div className="">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-[14px] w-[100px] bg-muted" />
                </div>
                <Skeleton className="h-[11px] w-[70px] bg-muted" />
              </div>
            </div>
          </div>
          {/* Channel Action Section */}
          <div className="flex items-center gap-2">
            <Button disabled size={"sm"} className="px-4 font-bold">
              Follow
            </Button>
            <Button
              disabled
              size={"sm"}
              className="px-4 font-bold"
              variant={"secondary"}
            >
              Zap
            </Button>
          </div>
        </div>
        {/* Video actions */}
        <div className="ml-auto flex items-center gap-3 text-muted-foreground">
          <LikeToggleButton likeCount={0} onClick={(action) => {}} />
          <DropDownOptions />
        </div>
      </div>
      {/* Metadata Section */}
      <div
        className={cn(
          "rounded-xl bg-muted p-3",
          true && "cursor-pointer transition-all",
        )}
      >
        <div className="space-y-1.5 pt-1 text-sm text-muted-foreground">
          <Skeleton className="h-3 w-3/4 bg-background" />
          <Skeleton className="h-3 w-2/5 bg-background" />
          <Skeleton className="h-3 w-2/3 bg-background" />
          <Skeleton className="h-3 w-3/5 bg-background" />
        </div>
      </div>
    </div>
  );
}
