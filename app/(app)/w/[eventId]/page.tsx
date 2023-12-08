"use client";
import { nip19 } from "nostr-tools";
import { redirect } from "next/navigation";
import PlaybackPage from "./PlaybackPage";
import Spinner from "@/components/spinner";
import { useEvent } from "@/lib/hooks/useEvents";

export default function Page({
  params: { eventId },
}: {
  params: {
    eventId: string;
  };
}) {
  const { data, type } = nip19.decode(eventId);
  if (type !== "naddr") {
    throw new Error("Invalid event");
  }
  const { identifier, kind, pubkey } = data;
  const { event, isLoading } = useEvent({
    filter: {
      kinds: [kind],
      authors: [pubkey],
      ["#d"]: [identifier],
    },
  });
  if (isLoading || !event) {
    return (
      <div className="">
        <Spinner />
      </div>
    );
  }
  return <PlaybackPage event={event} />;
}
