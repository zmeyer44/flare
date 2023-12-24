"use client";
import { useState } from "react";
import Link from "next/link";

import {
  cn,
  getTwoLetters,
  getNameToShow,
  formatCount,
  copyText,
  formatNumber,
} from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HiCheckBadge } from "react-icons/hi2";
import DropDownOptions from "@/components/custom-buttons/DropDownOptions";
import LikeButton from "./LikeButton";
import LikeToggleButton from "@/components/custom-buttons/LikeToggleButton";
import FollowButton from "@/components/custom-buttons/FollowButton";
import { Skeleton } from "@/components/ui/skeleton";
import { RenderText } from "@/components/textRendering";

import useProfile from "@/lib/hooks/useProfile";
import { relativeTime } from "@/lib/utils/dates";
import { toast } from "sonner";
import useVideo, { getVideoDetails } from "@/lib/hooks/useVideo";
import type { NDKKind, NDKEvent } from "@nostr-dev-kit/ndk";
import useExpandableContainer from "@/lib/hooks/useExpandableContainer";
import ZapButton from "@/components/custom-buttons/ZapButton";

type VideoActionsProps = {
  event: NDKEvent;
};
export default function VideoActions({ event }: VideoActionsProps) {
  const npub = event.author.npub;
  const { profile, followers } = useProfile(event.author.pubkey, {
    fetchFollowerCount: true,
  });
  const { ExpandButton, contentRef, containerStyles } = useExpandableContainer({
    maxHeight: 200,
  });
  const { viewCount, video } = useVideo({
    eventIdentifier: event.tagId(),
    getViewCount: true,
  });
  const { url, author, publishedAt, summary, title } =
    video ?? getVideoDetails(event);

  const rawEvent = event.rawEvent();

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
              href={`/channel/${npub}`}
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
                  {!!followers.length &&
                    `${formatCount(followers.length)} followers`}
                </p>
              </div>
            </Link>
          </div>
          {/* Channel Action Section */}
          <div className="flex items-center gap-2">
            <FollowButton
              size={"sm"}
              className="px-4 font-bold"
              pubkey={event.author.pubkey}
            />
            <ZapButton
              zapType="event"
              event={event.rawEvent()}
              size={"sm"}
              className="px-4 font-bold"
              variant={"secondary"}
            />
          </div>
        </div>
        {/* Video actions */}
        <div className="ml-auto flex items-center gap-3 text-muted-foreground">
          <LikeButton contentEvent={event} />
          <DropDownOptions
            options={[
              {
                label: "Share video",
                action: () => {
                  copyText(
                    `${
                      process.env.NEXT_PUBLIC_ROOT_DOMAIN ??
                      "https://www.flare.pub"
                    }/w/${event.encode()}`,
                  );
                  toast.success("Link copied!");
                },
              },
              {
                label: "Copy raw event",
                action: () => {
                  copyText(JSON.stringify(rawEvent));
                  toast.success("Copied event");
                },
              },
            ]}
          />
        </div>
      </div>

      {/* Metadata Section */}
      <div
        ref={contentRef}
        className={cn(
          "relative rounded-xl bg-muted p-3",
          false &&
            " cursor-pointer transition-all hover:bg-muted-foreground/30",
        )}
        style={containerStyles}
      >
        <div className="flex items-center gap-x-1.5 text-[13px] font-semibold text-foreground">
          <p>{`${formatNumber(viewCount)} views`}</p>
          {!!publishedAt && (
            <>
              <span>•</span>
              <p>{relativeTime(new Date(publishedAt * 1000))}</p>
            </>
          )}
        </div>
        <div className="overflow-hidden whitespace-break-spaces break-words text-sm text-muted-foreground">
          <RenderText text={summary} />
        </div>
        <ExpandButton className="absolute inset-x-0 bottom-0 z-20 mt-[-55px]">
          <div className="h-[40px] w-full bg-gradient-to-b from-transparent to-muted"></div>
          <div className="h-[25px] bg-muted text-xs font-medium leading-none">
            <span>See more...</span>
          </div>
        </ExpandButton>
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
                <div className="mb-1.5 flex items-center gap-1">
                  <Skeleton className="h-[12px] w-[100px] bg-muted" />
                </div>
                <Skeleton className="h-[9px] w-[70px] bg-muted" />
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
          <DropDownOptions options={[]} />
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
