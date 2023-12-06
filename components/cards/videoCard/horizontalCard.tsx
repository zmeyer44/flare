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

type VideoCardProps = {
  className?: string;
};

export default function HorizontalVideoCard({ className }: VideoCardProps) {
  const card = {
    image:
      "https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fwill-the-p_7249fefe2495a5a6a4725d481e381b12_256x256_qual_100.webp&w=256&q=100",
    title: "First YouTube video playback",
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
    <div className={cn("group flex space-x-3", className)}>
      <div className="relative w-[120px] overflow-hidden rounded-md">
        <AspectRatio ratio={21 / 15} className="bg-muted">
          <Image
            src={card.image}
            alt={card.title}
            width={150}
            height={70}
            unoptimized
            className={cn(
              "!h-full w-auto object-cover transition-all group-hover:scale-105",
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
      <div className="flex-1 space-y-2 text-base">
        <h3 className="line-clamp-2 font-medium leading-none">{card.title}</h3>
        <div className="flex flex-col items-start gap-y-1">
          <div className="flex items-center gap-x-1 text-xs text-muted-foreground">
            <p>2.7k views</p>
            <span>•</span>
            <p>12hrs</p>
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
