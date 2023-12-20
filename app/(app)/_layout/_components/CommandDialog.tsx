"use client";
import { useState, useEffect } from "react";
import { useKeyboardShortcut } from "@/lib/hooks/useKeyboardShortcut";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { RiSearchLine } from "react-icons/ri";

import { atom, useAtom } from "jotai";
import useSearch from "@/lib/hooks/useSearch";
import { cn } from "@/lib/utils";
import Spinner from "@/components/spinner";

type SearchSuggestionObject = {
  index: string;
  hits: {
    title: string;
    summary?: string;
    kind: number;
    identifier: string;
    pubkey: string;
  }[];
};
export const commandDialogAtom = atom(false);

export default function CommandDialogComponent() {
  const [open, setOpen] = useAtom(commandDialogAtom);
  useKeyboardShortcut(["ctrl", "k"], () => setOpen((open) => !open));

  const [searchInput, setSearchInput] = useState("");
  const [debounce, setDebounce] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestionObject[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [mounted] = useState(true);
  const { search } = useSearch();

  const handleSearch = async () => {
    setSearching(true);
    const results = await search(searchInput);
    const processedResults = results?.map((r) => ({
      index: r.index,
      hits: r.hits as unknown as {
        title: string;
        summary?: string;
        kind: number;
        identifier: string;
        pubkey: string;
      }[],
    }));
    setSuggestions(processedResults ?? []);
    setSearching(false);
    if (!searched) {
      setSearched(true);
    }
  };
  useEffect(() => {
    if (mounted && searchInput !== "") {
      setTimeout(() => {
        if (searchInput === debounce) {
          void handleSearch();
        } else {
          setDebounce(searchInput);
        }
      }, 150);
    }
  }, [searchInput, debounce]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      {/* <CommandInput placeholder="Search videos..." /> */}
      <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
        <MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <input
          onChange={(e) => setSearchInput(e.target.value)}
          className={cn(
            "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:h-12",
          )}
          placeholder="Search videos..."
        />
      </div>
      <CommandList className="scrollbar-thin scrollbar-track-muted/40 scrollbar-thumb-muted">
        {suggestions.map((s) => {
          return (
            <CommandGroup key={s.index} heading={s.index}>
              {s.hits.map((h) => (
                <CommandItem key={`${h.kind}:${h.pubkey}:${h.identifier}`}>
                  {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
                  <span>{h.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
        {!suggestions.flatMap((e) => e.hits)?.length && (
          <div className="center py-6 text-muted-foreground/80 sm:min-h-[200px]">
            {searching ? (
              <Spinner />
            ) : searchInput ? (
              <div className="text-center text-sm sm:text-base">
                No results found.
              </div>
            ) : (
              <div className="center gap-x-2 text-center text-sm sm:text-base">
                <p>Search for a video</p>
                <MagnifyingGlassIcon className="h-4 w-4" />
              </div>
            )}
          </div>
        )}
        {/* <CommandSeparator /> */}
      </CommandList>
    </CommandDialog>
  );
}
