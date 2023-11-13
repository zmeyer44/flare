"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
const topics = [
  { label: "All", value: "" },
  { label: "Bitcoin", value: "bitcoin" },
  { label: "Politics", value: "politics" },
  { label: "Business", value: "business" },
  { label: "Sports", value: "sports" },
  { label: "Pop Culture", value: "pop-culture" },
  { label: "Science", value: "science" },
  { label: "Shit Coins", value: "shit-coins" },
];
export default function TopicsNav() {
  const [activeTopic, setActiveTopic] = useState("");
  return (
    <nav className="flex h-[var(--header-nav-height)] items-stretch gap-2 overflow-x-auto px-2 scrollbar-none sm:gap-3">
      {topics.map((t, index) => (
        <button
          key={t.value}
          onClick={() => setActiveTopic(t.value)}
          className="relative whitespace-nowrap rounded-t-lg px-4 transition-all hover:bg-muted"
        >
          <div
            className={cn(
              "center text-sm font-medium text-muted-foreground sm:text-[16px]",
              t.value === activeTopic && "text-foreground",
            )}
          >
            <span>{t.label}</span>
          </div>
          {t.value === activeTopic && (
            <div className="absolute inset-x-0 bottom-0 h-[3px] w-full rounded-full bg-foreground"></div>
          )}
        </button>
      ))}
    </nav>
  );
}
