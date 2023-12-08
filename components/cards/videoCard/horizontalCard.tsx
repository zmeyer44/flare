"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Split from "@/components/spread/Split";
import { Button } from "@/components/ui/button";
import { formatCount } from "@/lib/utils";
import { useMarket } from "@/lib/hooks/useMarket";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, getTwoLetters, getNameToShow } from "@/lib/utils";
import { HiCheckBadge } from "react-icons/hi2";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { getTagValues } from "@/lib/nostr/utils";
import useProfile from "@/lib/hooks/useProfile";
import { relativeTime } from "@/lib/utils/dates";

type VideoCardProps = {
  className?: string;
  event: NDKEvent;
};

export default function HorizontalVideoCard({
  className,
  event,
}: VideoCardProps) {
  const npub = event.author.npub;
  const { profile } = useProfile(event.author.pubkey);
  const image = getTagValues("image", event.tags) as string;
  const title = getTagValues("title", event.tags) as string;
  return (
    <div className={cn("group flex space-x-3", className)}>
      <div className="relative h-full w-[120px]  overflow-hidden rounded-md">
        <AspectRatio ratio={21 / 14} className="bg-muted">
          <Image
            src={image}
            alt={title}
            width={150}
            height={70}
            unoptimized
            className={cn(
              "h-full w-full object-cover transition-all group-hover:scale-105",
              "aspect-[21/14]",
            )}
          />
        </AspectRatio>
        {false && (
          <div className="pointer-events-none absolute bottom-0 right-0 p-2">
            <Badge variant={"red"}>LIVE</Badge>
          </div>
        )}
      </div>
      <div className="flex-1 space-y-1 pt-0.5 text-base">
        <h3 className="mt-0 line-clamp-2 text-[15px] font-medium leading-4">
          {title}
        </h3>
        <div className="flex flex-col items-start gap-y-1">
          <div className="flex items-center gap-x-1 text-xs text-muted-foreground">
            <p>2.7k views</p>
            {!!event.created_at && (
              <>
                <span>•</span>
                <p>{relativeTime(new Date(event.created_at * 1000))}</p>
              </>
            )}
          </div>
        </div>
        <div className="flex">
          <Link
            href={`/${npub}`}
            className="center group gap-x-2 rounded-sm rounded-r-full pr-1 text-muted-foreground hover:shadow"
          >
            <Avatar className="center h-[20px] w-[20px] overflow-hidden rounded-[.35rem] bg-muted">
              <AvatarImage
                className="object-cover"
                src={profile?.image}
                alt={profile?.displayName}
              />
              <AvatarFallback className="text-[9px]">
                {getTwoLetters({ npub, profile })}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1">
              <span className="truncate text-[12px] font-semibold">
                {getNameToShow({ npub, profile })}
              </span>
              {!!profile?.nip05 && (
                <HiCheckBadge className="h-[12px] w-[12px] text-primary" />
              )}
            </div>
          </Link>
        </div>
      </div>
      {/* <div className="-mt-1 flex flex-wrap-reverse gap-2 overflow-x-scroll scrollbar-none">
        {card.tags.slice(0, 3).map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div> */}
    </div>
  );
}
export function HorizontalVideoCardLoading({
  className,
}: Omit<VideoCardProps, "event">) {
  return (
    <div className={cn("group flex space-x-3", className)}>
      <div className="relative h-full w-[120px]  overflow-hidden rounded-md">
        <AspectRatio ratio={21 / 14} className="bg-muted"></AspectRatio>
        {false && (
          <div className="pointer-events-none absolute bottom-0 right-0 p-2">
            <Badge variant={"red"}>LIVE</Badge>
          </div>
        )}
      </div>
      <div className="flex-1 space-y-1 pt-0.5 text-base">
        <Skeleton className="mb-2 h-4 w-2/3 bg-muted" />
        <div className="flex flex-col items-start gap-y-1">
          <div className="flex items-center gap-x-1 text-xs text-muted-foreground">
            <Skeleton className="mb-1 h-3 w-[100px] bg-muted" />
            <Skeleton className="mb-1 h-3 w-[150px] bg-muted" />
          </div>
        </div>
        <div className="flex">
          <div className="center group gap-x-2 rounded-sm rounded-r-full pr-1 text-muted-foreground hover:shadow">
            <Avatar className="center h-[20px] w-[20px] overflow-hidden rounded-[.35rem] bg-muted">
              <AvatarFallback className="text-[9px]"></AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1">
              <Skeleton className="h-[12px] w-[100px] bg-muted" />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="-mt-1 flex flex-wrap-reverse gap-2 overflow-x-scroll scrollbar-none">
        {card.tags.slice(0, 3).map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div> */}
    </div>
  );
}
