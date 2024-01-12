"use client";

import { useState, useEffect } from "react";
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
import Spinner from "../spinner";
import { cn } from "@/lib/utils";

type SearchModalProps<ResultSchema> = {
  searchResultsComponent: (props: ResultSchema) => React.ReactNode;
  loadingComponent?: () => React.ReactNode;
  onSearch: (query: string) => Promise<ResultSchema[]>;
  onSelect: (selection: ResultSchema) => void;
  displayText?: string;
  placeholder?: string;
  title?: string;
};

export default function SearchModal<ResultSchema extends { id: string }>({
  searchResultsComponent: SearchResultsComponent,
  loadingComponent: LoadingComponent = () => (
    <div>
      <Spinner />
    </div>
  ),
  onSearch,
  onSelect,
  displayText = "Search",
  placeholder = "Search...",
  title,
}: SearchModalProps<ResultSchema>) {
  const [query, setQuery] = useState("");
  const [debounce, setDebounce] = useState("");
  const [searching, setSearching] = useState(false);
  const [mounted] = useState(true);
  const [results, setResults] = useState<ResultSchema[]>([]);

  const handleSearch = async () => {
    setSearching(true);
    const response = await onSearch(query);
    setResults(response);
    setSearching(false);
  };

  useEffect(() => {
    if (mounted && query !== "") {
      setTimeout(() => {
        if (query === debounce) {
          void handleSearch();
        } else {
          setDebounce(query);
        }
      }, 150);
    }
  }, [query, debounce]);
  return (
    <div>
      {!!title && (
        <div className="flex pb-5">
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
      )}
      <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
        <MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <input
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:h-12",
          )}
          placeholder={placeholder}
        />
      </div>
      <ul className="max-h-[60svh] max-w-[450px] divide-y overflow-y-auto scrollbar-thin scrollbar-track-muted/40 scrollbar-thumb-muted">
        {results.map((s) => {
          return (
            <li key={s.id} className="py-1">
              <button
                onClick={() => onSelect(s)}
                className="w-full overflow-hidden rounded-lg px-1 py-1 hover:bg-muted"
              >
                <SearchResultsComponent {...s} />
              </button>
            </li>
          );
        })}
        {!results.length && (
          <div className="center w-full py-6 text-muted-foreground/80 sm:min-h-[200px]">
            {searching ? (
              <LoadingComponent />
            ) : query ? (
              <div className="text-center text-sm sm:text-base">
                No results found.
              </div>
            ) : (
              <div className="center gap-x-2 text-center text-sm sm:text-base">
                <p>{displayText}</p>
                <MagnifyingGlassIcon className="h-4 w-4" />
              </div>
            )}
          </div>
        )}
      </ul>
    </div>
  );
}
