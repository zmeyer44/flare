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

type ChannelCardProps = {
  className?: string;
};

export default function ChannelCard({ className }: ChannelCardProps) {
  const card = {
    image:
      "https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fwill-the-p_7249fefe2495a5a6a4725d481e381b12_256x256_qual_100.webp&w=256&q=100",
    title: "First YouTube Channel playback",
    tags: [],
  };
  const npub = "";
  const profile = {
    name: "Zach",
    displayName: "Zach Meyer",
    image:
      "https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fwill-the-p_7249fefe2495a5a6a4725d481e381b12_256x256_qual_100.webp&w=256&q=100",
    nip05: "zach@flockstr.com",
  };
  return (
    <div className={cn("group flex h-full flex-col space-y-2", className)}>
      <div className="relative overflow-hidden rounded-md">
        <AspectRatio ratio={10 / 16} className="bg-muted">
          <Image
            src={card.image}
            alt={card.title}
            width={150}
            height={250}
            unoptimized
            className={cn(
              "h-auto w-auto object-cover transition-all group-hover:scale-105",
              "aspect-[10/16]",
            )}
          />
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
                <span className="text-[14px] font-semibold">
                  {getNameToShow({ npub, profile })}
                </span>
                {!!profile?.nip05 && (
                  <HiCheckBadge className="h-[14px] w-[14px] text-primary" />
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
