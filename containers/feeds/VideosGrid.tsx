"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HorizontalVideoCard, {
  HorizontalVideoCardLoading,
} from "@/components/cards/videoCard/horizontalCard";
import VideoCard, { VideoCardLoading } from "@/components/cards/videoCard";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
import useEvents from "@/lib/hooks/useEvents";

type VerticalVideosFeedProps = {
  title?: string;
  action?: ReactNode;
  className?: string;
  filter?: NDKFilter;
  secondaryFilter?: (event: NDKEvent) => Boolean;
  loader?: () => JSX.Element;
  empty?: () => JSX.Element;
};

export default function VerticalVideosFeed({
  title,
  action,
  className,
  ...props
}: VerticalVideosFeedProps) {
  return (
    <div className={cn("w-full", className)}>
      {!!title && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          {action}
        </div>
      )}
      <div className="py-3">
        <RawFeed {...props} />
      </div>
    </div>
  );
}
export function VerticalVideosFeedLoading({
  title,
  action,
  className,
  ...props
}: VerticalVideosFeedProps) {
  return (
    <div className={cn("w-full", className)}>
      {!!title && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          {action}
        </div>
      )}
      <div className="py-3">
        <div className="md-feed-cols relative mx-auto gap-4">
          <VideoCardLoading />
          <VideoCardLoading />
          <VideoCardLoading />
          <VideoCardLoading />
          <VideoCardLoading />
        </div>
      </div>
    </div>
  );
}

function RawFeed({
  filter,
  secondaryFilter,
  loader: Loader,
  empty: Empty = () => (
    <div className="center text-center text-sm text-muted-foreground">
      <p>No videos found</p>
    </div>
  ),
}: {
  filter?: NDKFilter;
  secondaryFilter?: (event: NDKEvent) => Boolean;
  loader?: () => JSX.Element;
  empty?: () => JSX.Element;
}) {
  const { events, isLoading } = useEvents({
    filter: { ...filter },
  });
  if (isLoading) {
    if (Loader) {
      return <Loader />;
    }
    return (
      <div className="md-feed-cols relative mx-auto gap-4">
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
        <VideoCardLoading />
      </div>
    );
  }
  if (Empty && events.length === 0) {
    return <Empty />;
  }
  if (secondaryFilter) {
    return (
      <div className="md-feed-cols relative mx-auto gap-4">
        {events.filter(secondaryFilter).map((e) => (
          <Link key={e.id} href={`/w/${e.encode()}`}>
            <VideoCard event={e} />
          </Link>
        ))}
      </div>
    );
  }
  return (
    <div className="md-feed-cols relative mx-auto gap-4">
      {events.map((e) => (
        <Link key={e.id} href={`/w/${e.encode()}`}>
          <VideoCard event={e} />
        </Link>
      ))}
    </div>
  );
}
