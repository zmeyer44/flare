"use client";
import Link from "next/link";
import { useEvent } from "@/lib/hooks/useEvents";
import { nip19, type Event } from "nostr-tools";
import { NOSTR_BECH32_REGEXP } from "@/lib/nostr/utils";
import KindCard from "../kindCards";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";

type EventMentionProps = {
  mention: string;
};

function getEventId(mention: string) {
  try {
    if (NOSTR_BECH32_REGEXP.test(mention)) {
      const event = nip19.decode(mention);
      if (event.type === "nevent") {
        return event.data.id;
      }
    }
    return;
  } catch (err) {
    console.log("Error getting pubkey", err);
    return;
  }
}

export default function EventMention({ mention }: EventMentionProps) {
  //   const { user } = useProfile(mention);
  const eventId = getEventId(mention);

  const { event } = useEvent({
    filter: {
      ids: [eventId ?? ""],
      kinds: [1],
    },
  });
  if (event) {
    const rawEvent = event.rawEvent() as Event;
    return <KindCard className="border-2 border-primary" {...rawEvent} />;
  }
  return (
    <Link href={`/${mention}`}>
      <span className="text-primary hover:underline">{`*\$${mention}`}</span>
    </Link>
  );
}
