"use client";
import { Button } from "@/components/ui/button";
import HorizontalVideoCard from "@/components/cards/videoCard/horizontalCard";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type VerticalVideosFeedProps = {
  title?: string;
  action?: ReactNode;
  className?: string;
};

export default function VerticalVideosFeed({
  title,
  action,
  className,
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
        <ul>
          <li>
            <HorizontalVideoCard />
          </li>
        </ul>
      </div>
    </div>
  );
}
