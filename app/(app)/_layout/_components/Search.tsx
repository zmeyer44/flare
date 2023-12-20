"use client";

import { commandDialogAtom } from "./CommandDialog";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";

export default function Search() {
  const [open, setOpen] = useAtom(commandDialogAtom);
  return (
    <div className="w-full max-w-lg">
      <Button
        onClick={() => setOpen(true)}
        variant={"outline"}
        className="w-full items-center justify-start rounded-sm text-muted-foreground sm:pr-12"
      >
        <span className="hidden lg:inline-flex">Search...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
    </div>
  );
}
