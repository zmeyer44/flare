"use client";
import { cn, getTwoLetters, getNameToShow } from "@/lib/utils";
import { HiCheckBadge } from "react-icons/hi2";
import useProfile from "@/lib/hooks/useProfile";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCount, truncateText } from "@/lib/utils";
import { RenderText } from "@/components/textRendering";
import { Button } from "@/components/ui/button";
import useEvents from "@/lib/hooks/useEvents";
import type { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk";

export default function Feed({
  className,
  follows,
}: {
  className?: string;
  follows: NDKUser[];
}) {
  const { events } = useEvents({
    filter: {
      authors: follows?.length ? follows.map((f) => f.pubkey) : undefined,
      kinds: [1],
      limit: 50,
    },
  });
  const processeEvents = uniqBy((e) => e.id, events).slice(0, 40);
  return (
    <div
      className={cn(
        "relative min-h-[100vh] max-w-2xl rounded-2xl bg-muted/80 backdrop-blur",
        className,
      )}
    >
      <ul className="divide-y-[1px] divide-muted-foreground/20">
        {processeEvents.map((e, idx) => (
          <li key={e.id}>
            <Card event={e} />
          </li>
        ))}
      </ul>
    </div>
  );
}

import { RiChatSmile2Line, RiHeartLine, RiRepeatFill } from "react-icons/ri";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import { RiMore2Fill } from "react-icons/ri";
import { TbHeart, TbRepeat } from "react-icons/tb";
import { IoPaperPlaneOutline } from "react-icons/io5";

import DropDownMenu from "@/components/dropDownMenu";
import { relativeTimeSmall } from "@/lib/utils/dates";
import { uniqBy } from "ramda";
import { getTagValues } from "@/lib/nostr/utils";

type CardProps = {
  event: NDKEvent;
};
function Card({ event }: CardProps) {
  const npub = event.author.npub;
  const { profile } = useProfile(event.author.pubkey);
  return (
    <div className="w-full px-5 py-3">
      {/* Card Header */}
      <div className="flex justify-between">
        <div className="center group gap-x-2 overflow-hidden text-foreground">
          <Avatar className="center h-[44px] w-[44px] overflow-hidden rounded-full bg-muted">
            <AvatarImage
              className="object-cover"
              src={profile?.image}
              alt={profile?.displayName}
            />
            <AvatarFallback className="text-[15px]">
              {getTwoLetters({ npub, profile })}
            </AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1">
              <span className="line-clamp-1 break-all text-[14px] font-semibold">
                {getNameToShow({ npub, profile })}
              </span>
              {!!profile?.nip05 && (
                <HiCheckBadge className="h-[14px] w-[14px] shrink-0 text-primary" />
              )}
            </div>
            {/* <p className="text-xs text-muted-foreground">{`${formatCount(
              followers.length,
            )} followers`}</p> */}
            {profile?.nip05 ? (
              <p className="truncate text-xs text-muted-foreground">
                {profile.nip05}
              </p>
            ) : (
              <p className="truncate text-xs text-muted-foreground">
                {truncateText(npub)}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-x-2 text-muted-foreground">
          {!!event.created_at && (
            <p className="text-sm">
              {relativeTimeSmall(new Date(event.created_at * 1000))}
            </p>
          )}
          <DropDownMenu options={[]}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "center relative h-8 w-8 rounded-full text-muted-foreground",
              )}
            >
              <RiMore2Fill className="h-[18px] w-[18px]" />
            </Button>
          </DropDownMenu>
        </div>
      </div>
      {/* Body */}
      <div className="overflow-hidden py-1 pt-2 text-sm">
        <RenderText text={event.content} />
      </div>

      {/* Actions */}
      <div className="flex gap-x-6  pt-2">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "center relative h-8 w-8 rounded-full text-muted-foreground",
          )}
        >
          <RiChatSmile2Line className="h-[18px] w-[18px]" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "center relative h-8 w-8 rounded-full text-muted-foreground",
          )}
        >
          <TbHeart className="h-[18px] w-[18px]" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "center relative h-8 w-8 rounded-full text-muted-foreground",
          )}
        >
          <TbRepeat className="h-[18px] w-[18px]" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "center relative h-8 w-8 rounded-full text-muted-foreground",
          )}
        >
          <HiOutlineLightningBolt className="h-[18px] w-[18px]" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "center relative h-8 w-8 rounded-full text-muted-foreground",
          )}
        >
          <IoPaperPlaneOutline className="h-[18px] w-[18px]" />
        </Button>
      </div>
    </div>
  );
}
