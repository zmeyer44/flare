"use client";
import { Button } from "@/components/ui/button";
import HorizontalVideoCard from "@/components/cards/videoCard/horizontalCard";
import { ReactNode } from "react";
import { cn, getTwoLetters } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { NDKUser } from "@nostr-dev-kit/ndk";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useProfile from "@/lib/hooks/useProfile";
import { nip19 } from "nostr-tools";

type HorizontalUsersScrollableProps = {
  title?: string;
  action?: ReactNode;
  className?: string;
  avatarClassname?: string;
  users: string[];
};

export default function HorizontalUsersScrollable({
  title,
  action,
  className,
  avatarClassname,
  users,
}: HorizontalUsersScrollableProps) {
  return (
    <div className={cn("w-full", className)}>
      {!!title && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          {action}
        </div>
      )}
      <div className="py-3">
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-2 p-2">
            {users.map((user) => (
              <figure key={user} className="shrink-0">
                <User pubkey={user} className={avatarClassname} />
              </figure>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}

function User({ pubkey, className }: { pubkey: string; className?: string }) {
  const { profile } = useProfile(pubkey);
  const npub = nip19.npubEncode(pubkey);

  return (
    <Avatar
      className={cn(
        "relative inline-block h-8 w-8 rounded-full ring-2 ring-background",
        className,
      )}
    >
      <AvatarImage src={profile?.image} />
      <AvatarFallback>{getTwoLetters({ npub, profile })}</AvatarFallback>
    </Avatar>
  );
}
