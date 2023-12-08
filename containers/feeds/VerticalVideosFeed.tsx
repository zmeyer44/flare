"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HorizontalVideoCard, {
  HorizontalVideoCardLoading,
} from "@/components/cards/videoCard/horizontalCard";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { NDKEvent, type NDKFilter } from "@nostr-dev-kit/ndk";
import useEvents from "@/lib/hooks/useEvents";
import Spinner from "@/components/spinner";

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
        <ul className="space-y-3">
          <li>
            <HorizontalVideoCardLoading />
          </li>
          <li>
            <HorizontalVideoCardLoading />
          </li>
          <li>
            <HorizontalVideoCardLoading />
          </li>
          <li>
            <HorizontalVideoCardLoading />
          </li>
        </ul>
      </div>
    </div>
  );
}

function RawFeed({
  filter,
  secondaryFilter,
  loader: Loader,
  empty: Empty,
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
      <ul className="space-y-3">
        <li>
          <HorizontalVideoCardLoading />
        </li>
        <li>
          <HorizontalVideoCardLoading />
        </li>
        <li>
          <HorizontalVideoCardLoading />
        </li>
        <li>
          <HorizontalVideoCardLoading />
        </li>
      </ul>
    );
  }
  if (Empty && events.length === 0) {
    return <Empty />;
  }
  if (secondaryFilter) {
    return (
      <ul className="space-y-3">
        {events.filter(secondaryFilter).map((e) => (
          <li key={e.id}>
            <Link href={`/w/${e.encode()}`}>
              <HorizontalVideoCard event={e} />
            </Link>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="space-y-3">
      {events.map((e) => (
        <li key={e.id}>
          <Link href={`/w/${e.encode()}`}>
            <HorizontalVideoCard event={e} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
