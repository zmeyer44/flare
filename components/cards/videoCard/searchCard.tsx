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
import type { NDKEvent } from "@nostr-dev-kit/ndk";
import { getTagValues } from "@/lib/nostr/utils";
import useProfile from "@/lib/hooks/useProfile";
import { relativeTime } from "@/lib/utils/dates";
import useVideo, { getVideoDetails } from "@/lib/hooks/useVideo";
import { nip19 } from "nostr-tools";

type VideoCardProps = {
  className?: string;
  video: {
    title: string;
    summary?: string;
    thumbnail?: string;
    pubkey: string;
    published_at: number;
  };
};

export default function SearchVideoCard({
  className,
  video: { title, summary, thumbnail, pubkey, published_at },
}: VideoCardProps) {
  const npub = nip19.npubEncode(pubkey);
  const { profile } = useProfile(pubkey);
  return (
    <div className={cn("group flex space-x-3 overflow-hidden", className)}>
      <div className="relative h-full w-[70px] shrink-0 overflow-hidden rounded-md">
        <AspectRatio ratio={21 / 14} className="bg-muted">
          {!!thumbnail && (
            <Image
              src={thumbnail}
              alt={title}
              width={150}
              height={70}
              unoptimized
              className={cn("h-full w-full object-cover", "aspect-[21/14]")}
            />
          )}
        </AspectRatio>
      </div>
      <div className="flex-1 space-y-0.5 overflow-hidden pt-0.5 text-base">
        <div className="flex items-center gap-x-2">
          <h3 className="mt-0 line-clamp-1 text-base font-medium">{title}</h3>{" "}
          {!!published_at && (
            <div className="flex shrink-0 items-center gap-x-1 text-xs text-muted-foreground">
              <span>•</span>
              <span className="line-clamp-1 shrink-0">
                {relativeTime(new Date(published_at * 1000))}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-start gap-y-1 overflow-hidden">
          <div className="flex items-center gap-x-3 overflow-hidden text-xs text-muted-foreground">
            <p className="line-clamp-1 break-words">{summary}</p>
            <div className="flex">
              <Link
                href={`/channel/${npub}`}
                className="center group gap-x-1.5 rounded-sm rounded-r-full pr-1 text-muted-foreground hover:shadow"
              >
                <Avatar className="center h-[16px] w-[16px] overflow-hidden rounded-[.3rem] bg-muted">
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
                    <HiCheckBadge className="h-[8px] w-[8px] text-primary" />
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export function SearchVideoCardLoading({
  className,
}: Omit<VideoCardProps, "video">) {
  return (
    <div className={cn("group flex space-x-3 ", className)}>
      <div className="relative h-full w-[70px]  overflow-hidden rounded-md">
        <AspectRatio ratio={21 / 14} className="bg-muted"></AspectRatio>
      </div>
      <div className="flex-1 space-y-1  pt-0.5 text-base">
        <Skeleton className="mb-2 h-3.5 w-2/3 bg-muted" />
        <div className="flex flex-col items-start gap-y-1 ">
          <div className="flex w-full items-center gap-x-2 text-xs text-muted-foreground">
            <Skeleton className="h-2.5 w-2/5 bg-muted" />
            <div className="flex">
              <div className="center group gap-x-1.5 rounded-sm rounded-r-full pr-1 text-muted-foreground">
                <Avatar className="center h-[16px] w-[16px] overflow-hidden rounded-[.3rem] bg-muted">
                  <AvatarFallback className="text-[9px]"></AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-[8px] w-[60px] bg-muted" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
