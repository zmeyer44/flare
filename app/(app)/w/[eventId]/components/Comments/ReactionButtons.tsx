"use client";

import type { NDKEvent } from "@nostr-dev-kit/ndk";
import useEvents from "@/lib/hooks/useEvents";
import { useNDK } from "@/app/_providers/ndk";
import { createEvent } from "@/lib/actions/create";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import {
  HiOutlineHandThumbUp,
  HiOutlineHandThumbDown,
  HiHandThumbUp,
  HiHandThumbDown,
} from "react-icons/hi2";
import { modal } from "@/app/_providers/modal";
import AuthModal from "@/components/modals/auth";
import { formatCount } from "@/lib/utils";

type ReactionButtosProps = {
  event: NDKEvent;
};
export default function ReactionButtons({ event }: ReactionButtosProps) {
  const { currentUser } = useCurrentUser();
  const { ndk } = useNDK();
  const { events } = useEvents({
    filter: {
      kinds: [7],
      ["#e"]: [event.id],
    },
  });
  const downVotes = events.filter((e) => e.content === "-").length;
  const upVotes = events.length - downVotes;

  async function handleLike(action: string) {
    if (!currentUser || !ndk) return;
    try {
      const preEvent = {
        content: action,
        pubkey: currentUser.pubkey,
        tags: [["e", event.id]],
        kind: 7,
      };
      const newEvent = await createEvent(ndk, preEvent);
      if (newEvent) {
        console.log("Event", newEvent);
      } else {
        console.log("Error adding reaction");
      }
    } catch (err) {
      console.log("error submitting event");
    }
  }
  const activeReaction = events.filter(
    (e) => e.pubkey === currentUser?.pubkey,
  )?.[0]?.content as "-" | "+" | "" | undefined;

  function handleReact(action: "+" | "-") {
    if (currentUser) {
      handleLike(action);
    } else {
      modal.show(<AuthModal />, {
        id: "login",
      });
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={() => handleReact("+")}
        disabled={!currentUser}
        size={"sm"}
        variant={"ghost"}
        className="gap-x-1.5 px-2"
      >
        {activeReaction === "+" ? (
          <HiHandThumbUp className="h-4 w-4" />
        ) : (
          <HiOutlineHandThumbUp className="h-4 w-4" />
        )}
        {!!upVotes && (
          <span className="text-xs font-bold">{formatCount(upVotes)}</span>
        )}
      </Button>
      <Button
        onClick={() => handleReact("-")}
        disabled={!currentUser}
        size={"sm"}
        variant={"ghost"}
        className="gap-x-1.5 px-2"
      >
        {activeReaction === "-" ? (
          <HiHandThumbDown className="h-4 w-4" />
        ) : (
          <HiOutlineHandThumbDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
