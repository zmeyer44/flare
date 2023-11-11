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
    <nav className="h-[var(--header-nav-height)] items-stretch flex gap-2 sm:gap-3 overflow-x-auto scrollbar-none px-2">
      {topics.map((t, index) => (
        <button
          onClick={() => setActiveTopic(t.value)}
          className="relative whitespace-nowrap px-4 hover:bg-muted transition-all rounded-t-lg"
        >
          <div
            className={cn(
              "center text-sm sm:text-[16px] text-muted-foreground font-medium",
              t.value === activeTopic && "text-foreground"
            )}
          >
            <span>{t.label}</span>
          </div>
          {t.value === activeTopic && (
            <div className="absolute inset-x-0 bottom-0 w-full h-[3px] bg-foreground rounded-full"></div>
          )}
        </button>
      ))}
    </nav>
  );
}
