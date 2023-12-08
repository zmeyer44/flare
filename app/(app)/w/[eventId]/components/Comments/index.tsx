"use client";

import CommentInput from "./CommentInput";
import CommentFeed from "./CommentFeed";
import useEvents from "@/lib/hooks/useEvents";

type CommentSectionProps = {
  eventReference: string;
};

export default function CommentSection({
  eventReference,
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
            123 Comments
          </h2>
        </div>
      </div>
      <CommentInput />
      <CommentFeed comments={events} />
    </section>
  );
}
