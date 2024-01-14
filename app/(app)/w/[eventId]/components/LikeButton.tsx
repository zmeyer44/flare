"use client";
import { useState } from "react";
import LikeToggleButton from "@/components/custom-buttons/LikeToggleButton";
import type { NDKEvent } from "@nostr-dev-kit/ndk";
import useEvents from "@/lib/hooks/useEvents";
import { useNDK } from "@/app/_providers/ndk";
import { createEvent } from "@/lib/actions/create";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { modal } from "@/app/_providers/modal";
import AuthModal from "@/components/modals/auth";

type LikeButtonProps = {
  contentEvent: NDKEvent;
};
export default function LikeButton({ contentEvent }: LikeButtonProps) {
  const { currentUser } = useCurrentUser();
  const { ndk } = useNDK();
  const { events } = useEvents({
    filter: {
      kinds: [7],
      ["#e"]: [contentEvent.id],
    },
  });
  const downVotes = events.filter((e) => e.content === "-").length;
  const upVotes = events.length - downVotes;

  async function handleLike(action: string) {
    if (!currentUser) {
      modal.show(<AuthModal />, { id: "auth" });
      return;
    }
    if (!ndk) return;
    try {
      const preEvent = {
        content: action,
        pubkey: currentUser.pubkey,
        tags: [["e", contentEvent.id]],
        kind: 7,
      };
      const event = await createEvent(ndk, preEvent);
      if (event) {
        console.log("Event", event);
      } else {
        console.log("Error adding reaction");
      }
    } catch (err) {
      console.log("error submitting event");
    }
  }
  const activeReaction = events.filter(
    (e) => e.pubkey === currentUser?.pubkey,
  )?.[0]?.content as "-" | "+" | undefined;
  return (
    <LikeToggleButton
      active={activeReaction}
      likeCount={upVotes}
      onClick={(action) => {
        handleLike(action);
      }}
    />
  );
}
