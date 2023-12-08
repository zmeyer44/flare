"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getTwoLetters, getNameToShow } from "@/lib/utils";
import type { NDKEvent } from "@nostr-dev-kit/ndk";
import useProfile from "@/lib/hooks/useProfile";
import { HiCheckBadge } from "react-icons/hi2";
import { RenderText } from "@/components/textRendering";
import { Button } from "@/components/ui/button";
import { HiOutlineHandThumbUp, HiOutlineHandThumbDown } from "react-icons/hi2";

type CommentBodyProps = {
  event: NDKEvent;
};
export default function CommentBody({ event }: CommentBodyProps) {
  const npub = event.author.npub;
  const { profile } = useProfile(event.author.pubkey);
  return (
    <div className="flex gap-x-4">
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
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="line-clamp-1 text-[14px] font-semibold">
              {getNameToShow({ npub, profile })}
            </span>
            {!!profile?.nip05 && (
              <HiCheckBadge className="h-[14px] w-[14px] shrink-0 text-primary" />
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">2.5k followers</p>
        </div>
        <div className="">
          <RenderText text={event.content} />
        </div>
        <div className="flex items-center gap-1">
          <Button size={"sm"} variant={"ghost"} className="gap-x-1.5 px-2">
            <HiOutlineHandThumbUp className="h-4 w-4" />
          </Button>
          <Button size={"sm"} variant={"ghost"} className="gap-x-1.5 px-2">
            <HiOutlineHandThumbDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
