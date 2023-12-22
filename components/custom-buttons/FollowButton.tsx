"use client";
import { useState, ComponentProps } from "react";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { useNDK } from "@/app/_providers/ndk";
import { toast } from "sonner";
import LoginModal from "@/components/modals/login";
import { modal } from "@/app/_providers/modal";
import { follow } from "@/lib/actions/create";
import { NDKUser } from "@nostr-dev-kit/ndk";

import { Button } from "@/components/ui/button";

type FollowButtonProps = {
  pubkey: string;
} & ComponentProps<typeof Button>;

export default function FollowButton({
  pubkey,
  ...buttonProps
}: FollowButtonProps) {
  const [followLoading, setFollowLoading] = useState(false);
  const { currentUser, addFollow, follows, setFollows } = useCurrentUser();
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

  if (Array.from(follows).find((i) => i.pubkey === pubkey)) {
    return (
      <Button
        onClick={() => {
          handleUnfollow();
        }}
        loading={followLoading}
        variant={"secondary"}
        {...buttonProps}
      >
        Unfollow
      </Button>
    );
  } else {
    return (
      <Button
        onClick={() => {
          if (!currentUser) {
            modal.show(<LoginModal />, {
              id: "login",
            });
          } else {
            handleFollow();
          }
        }}
        loading={followLoading}
        {...buttonProps}
      >
        Follow
      </Button>
    );
  }
}
