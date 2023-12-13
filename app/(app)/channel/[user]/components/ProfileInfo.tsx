"use client";
import { useState } from "react";
import Link from "next/link";
import { cn, getTwoLetters, getNameToShow, formatCount } from "@/lib/utils";
import type { NDKUserProfile } from "@nostr-dev-kit/ndk";
import { NDKUser } from "@nostr-dev-kit/ndk";

import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { useNDK } from "@/app/_providers/ndk";
import { toast } from "sonner";
import { follow } from "@/lib/actions/create";
import { useModal } from "@/app/_providers/modal/provider";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HiCheckBadge } from "react-icons/hi2";
import LoginModal from "@/components/modals/login";

export default function ProfileInfo({
  profile,
  npub,
  pubkey,
}: {
  profile: NDKUserProfile;
  npub: string;
  pubkey: string;
}) {
  const [followLoading, setFollowLoading] = useState(false);
  const { currentUser, addFollow, follows, setFollows } = useCurrentUser();
  const modal = useModal();
  const { ndk } = useNDK();

  async function handleFollow() {
    if (!ndk || !currentUser) return;
    setFollowLoading(true);
    try {
      await follow(ndk, currentUser, pubkey);
      addFollow(new NDKUser({ hexpubkey: pubkey }));
      toast.success("Following!");
    } catch (err) {
      console.log("Error", err);
    }
    setFollowLoading(false);
  }
  async function handleUnfollow() {
    if (!ndk || !currentUser) return;
    setFollowLoading(true);
    try {
      await follow(ndk, currentUser, pubkey, true);
      const newFollows = Array.from(follows).filter((i) => i.pubkey !== pubkey);
      setFollows(new Set(newFollows));
      toast.success("Unfollowed!");
    } catch (err) {
      console.log("Error", err);
    }
    setFollowLoading(false);
  }
  return (
    <div className="space-y-3">
      {/* Profile Image and name */}
      <div className="flex items-center justify-between">
        <div className="center group gap-x-3 rounded-sm rounded-r-full pr-1 text-foreground lg:gap-x-5">
          <Avatar className="center h-[48px] w-[48px] overflow-hidden rounded-[.55rem] bg-muted md:h-[60px] md:w-[60px] lg:h-[120px] lg:w-[120px]">
            <AvatarImage
              className="object-cover"
              src={profile?.image}
              alt={profile?.displayName}
            />
            <AvatarFallback className="text-[14px]">
              {getTwoLetters({ npub, profile })}
            </AvatarFallback>
          </Avatar>
          <div className="">
            <div className="flex items-center gap-1">
              <span className="truncate text-lg font-semibold lg:text-2xl">
                {getNameToShow({ npub, profile })}
              </span>
              {!!profile?.nip05 && (
                <HiCheckBadge className="h-[14px] w-[14px] text-primary lg:h-[18px] lg:w-[18px]" />
              )}
            </div>
            <p className="text-xs text-muted-foreground lg:text-sm">
              {`${formatCount(Array.from(follows).length) ?? 0} followers`}
            </p>
            <div className="hidden w-3/4 pt-2 lg:block">
              <div className="rounded-lg bg-muted">
                <p className="line-clamp-3 p-2 text-xs text-muted-foreground">
                  {profile.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
        {!Array.from(follows).find((i) => i.pubkey === pubkey) ? (
          <Button
            onClick={() => {
              if (!currentUser) {
                modal?.show(<LoginModal />);
              } else {
                handleFollow();
              }
            }}
            loading={followLoading}
            className=""
          >
            Follow
          </Button>
        ) : (
          <Button
            onClick={() => {
              if (!currentUser) {
                modal?.show(<LoginModal />);
              } else {
                handleUnfollow();
              }
            }}
            loading={followLoading}
            variant={"secondary"}
          >
            Unfollow
          </Button>
        )}
      </div>

      {/* Description and data */}
      <div className="lg:hidden">
        <div className="rounded-lg bg-muted">
          <p className="p-2 text-xs text-muted-foreground">{profile.bio}</p>
        </div>
      </div>
    </div>
  );
}
