"use client";

import CommentInput from "./CommentInput";
import CommentFeed from "./CommentFeed";
import useEvents from "@/lib/hooks/useEvents";
import { formatCount } from "@/lib/utils";
import { nip19 } from "nostr-tools";

type CommentSectionProps = {
  eventReference: string;
  eventId: string;
};

export default function CommentSection({
  eventReference,
  eventId,
}: CommentSectionProps) {
  const { events } = useEvents({
    filter: {
      kinds: [1],
      ["#a"]: [eventReference],
    },
  });

  return (
    <section className="space-y-2.5 py-2">
      {/* Comments Section */}
      <div className="">
        <div className="flex items-center">
          <h2 className="text-base font-semibold text-foreground">
            {events.length === 1
              ? "1 Comment"
              : `${formatCount(events.length)} Comments`}
          </h2>
        </div>
      </div>
      <CommentInput
        initialTags={[
          ["a", eventReference],
          ["e", eventId],
        ]}
      />
      <CommentFeed comments={events} />
    </section>
  );
}
