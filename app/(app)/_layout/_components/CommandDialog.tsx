"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
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

import { atom, useAtom } from "jotai";
import useSearch from "@/lib/hooks/useSearch";
import { cn } from "@/lib/utils";
import SearchVideoCard, {
  SearchVideoCardLoading,
} from "@/components/cards/videoCard/searchCard";
import { nip19 } from "nostr-tools";
import { toast } from "sonner";

type SearchSuggestionObject = {
  index: string;
  hits: {
    identifier: string;
    title: string;
    summary?: string;
    thumbnail?: string;
    kind: number;
    pubkey: string;
    published_at: number;
  }[];
};
export const commandDialogAtom = atom(false);
export const anonModeAtom = atom(false);

export default function CommandDialogComponent() {
  const [anon, setAnon] = useAtom(anonModeAtom);
  useKeyboardShortcut(["ctrl", "shift", "a"], () =>
    setAnon((a) => {
      if (a) {
        toast.success("Anon mode deactivated 👀");
      } else {
        toast.success("Anon mode activated 🥷");
      }
      return !a;
    }),
  );

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
        identifier: string;
        title: string;
        summary?: string;
        thumbnail?: string;
        kind: number;
        pubkey: string;
        published_at: number;
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
                <Link
                  key={nip19.naddrEncode(h)}
                  href={`/w/${nip19.naddrEncode(h)}`}
                  className="cursor-pointer"
                  onClick={() => setOpen(false)}
                >
                  <CommandItem>
                    <SearchVideoCard video={h} />
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
          );
        })}
        {!suggestions.flatMap((e) => e.hits)?.length && (
          <div className="center w-full py-6  text-muted-foreground/80 sm:min-h-[200px]">
            {searching ? (
              <CommandGroup heading="Videos" className="w-full">
                <CommandItem>
                  <SearchVideoCardLoading className="w-full" />
                </CommandItem>
                <CommandItem>
                  <SearchVideoCardLoading className="w-full" />
                </CommandItem>
                <CommandItem>
                  <SearchVideoCardLoading className="w-full" />
                </CommandItem>
                <CommandItem>
                  <SearchVideoCardLoading className="w-full" />
                </CommandItem>
              </CommandGroup>
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
