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
import useProfile from "@/lib/hooks/useProfile";
import { nip19 } from "nostr-tools";

type ChannelCardProps = {
  className?: string;
  channelPubkey: string;
};

export default function ChannelCard({
  className,
  channelPubkey,
}: ChannelCardProps) {
  const npub = nip19.npubEncode(channelPubkey);
  const { profile } = useProfile(channelPubkey);
  if (!profile) {
    return <ChannelCardLoading className={className} />;
  }

  return (
    <div className={cn("group flex h-full flex-col space-y-2", className)}>
      <div className="relative overflow-hidden rounded-md">
        <AspectRatio ratio={3 / 4} className="bg-muted">
          {!!profile.image && (
            <Image
              src={profile.image}
              alt={npub}
              width={200}
              height={320}
              unoptimized
              className={cn(
                "h-full w-full object-cover transition-all group-hover:scale-105",
                "aspect-[3/4]",
              )}
            />
          )}
        </AspectRatio>
        {false && (
          <div className="pointer-events-none absolute bottom-0 right-0 p-2">
            <Badge variant={"red"}>LIVE</Badge>
          </div>
        )}
      </div>
      <div className="flex-1 space-y-3 text-base">
        <div className="flex rounded-[10px] bg-muted p-2">
          <Link
            href={`/${npub}`}
            className="center group gap-x-2 text-foreground"
          >
            <Avatar className="center h-[34px] w-[34px] overflow-hidden rounded-[.35rem] bg-muted">
              <AvatarImage
                className="object-cover"
                src={profile?.image}
                alt={profile?.displayName}
              />
              <AvatarFallback className="text-[9px]">
                {getTwoLetters({ npub, profile })}
              </AvatarFallback>
            </Avatar>
            <div className="">
              <div className="flex items-center gap-1">
                <span className="line-clamp-1 text-[14px] font-semibold">
                  {getNameToShow({ npub, profile })}
                </span>
                {!!profile?.nip05 && (
                  <HiCheckBadge className="h-[14px] w-[14px] shrink-0 text-primary" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">2.5k followers</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
export function ChannelCardLoading({
  className,
}: Omit<ChannelCardProps, "channelPubkey">) {
  return (
    <div className={cn("group flex h-full flex-col space-y-2", className)}>
      <div className="relative overflow-hidden rounded-md">
        <AspectRatio ratio={3 / 4} className="bg-muted"></AspectRatio>
        {false && (
          <div className="pointer-events-none absolute bottom-0 right-0 p-2">
            <Badge variant={"red"}>LIVE</Badge>
          </div>
        )}
      </div>
      <div className="flex-1 space-y-3 text-base">
        <div className="flex h-[56px] rounded-[10px] bg-muted p-2">
          <div className="center group gap-x-2 text-foreground">
            <Avatar className="center h-[34px] w-[34px] overflow-hidden rounded-[.35rem] bg-background"></Avatar>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1">
                <Skeleton className="h-[12px] w-[100px] bg-background" />
              </div>
              <Skeleton className="h-[8px] w-[70px] bg-background" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
