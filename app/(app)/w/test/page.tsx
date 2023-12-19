"use client";
import { nip19 } from "nostr-tools";
import { redirect } from "next/navigation";
import PlaybackPage from "../[eventId]/PlaybackPage";
import Spinner from "@/components/spinner";
import { useEvent } from "@/lib/hooks/useEvents";
import LoadingPage from "../[eventId]/loading";
export const dynamic = "force-dynamic";
export default function Page() {
  const eventId =
    "naddr1qqr4x5mswy6xxmspz3mhxue69uhhyetvv9ujuerpd46hxtnfdupzq9m30t2dyr32gfwd5z3pj43y5zj2w0z0d96lz6c4j07g07jx7t2cqvzqqqy9hvm95n9c";
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
    return <LoadingPage />;
  }

  return <PlaybackPage event={event} />;
}
