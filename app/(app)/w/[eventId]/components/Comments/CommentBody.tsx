"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getTwoLetters, getNameToShow, formatCount } from "@/lib/utils";
import type { NDKEvent } from "@nostr-dev-kit/ndk";
import useProfile from "@/lib/hooks/useProfile";
import { HiCheckBadge } from "react-icons/hi2";
import { RenderText } from "@/components/textRendering";

import { relativeTime } from "@/lib/utils/dates";
import ReactionButtons from "./ReactionButtons";

type CommentBodyProps = {
  event: NDKEvent;
};
export default function CommentBody({ event }: CommentBodyProps) {
  const npub = event.author.npub;
  const { profile } = useProfile(event.author.pubkey);
  return (
    <div className="flex w-full gap-x-4 overflow-hidden">
      <Avatar className="center h-[40px] w-[40px] overflow-hidden rounded-[.55rem] bg-muted">
        <AvatarImage
          className="object-cover"
          src={profile?.image}
          alt={profile?.displayName}
        />
        <AvatarFallback className="text-[9px]">
          {getTwoLetters({
            npub: npub,
            profile: profile,
          })}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1 overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="line-clamp-1 text-[14px] font-semibold">
              {getNameToShow({ npub, profile })}
            </span>
            {!!profile?.nip05 && (
              <HiCheckBadge className="h-[14px] w-[14px] shrink-0 text-primary" />
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {relativeTime(new Date((event.created_at ?? 0) * 1000))}
          </p>
        </div>
        <div className="break-words">
          <RenderText text={event.content} />
        </div>
        <ReactionButtons event={event} />
      </div>
    </div>
  );
}
