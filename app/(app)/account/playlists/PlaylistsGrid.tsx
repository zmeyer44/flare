"use client";

import useEvents from "@/lib/hooks/useEvents";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import type { NDKKind, NostrEvent } from "@nostr-dev-kit/ndk";
import StackedPlaylistCard, {
  LoadingStackedPlaylistCard,
} from "@/components/playlist/stackedCards";
import { modal } from "@/app/_providers/modal";
import SearchModal from "@/components/modals/search";
import useSearch, { AlgoliaVideoResponse } from "@/lib/hooks/useSearch";
import SearchVideoCard from "@/components/cards/videoCard/searchCard";
import { toast } from "sonner";
import { updateList } from "@/lib/actions/create";
import { useNDK } from "@/app/_providers/ndk";
import { uniqBy } from "ramda";

export default function PlaylistsGrid() {
  const { currentUser } = useCurrentUser();
  const { ndk } = useNDK();
  const { events: playlists, isLoading } = useEvents({
    filter: {
      kinds: [30005 as NDKKind],
      authors: [currentUser?.pubkey ?? ""],
    },
  });
  const processedPlaylists = uniqBy(
    (e) => e.tagId(),
    playlists.sort((a, b) => {
      if (!a.created_at || !b.created_at) return 0;
      if (a.created_at > b.created_at) {
        return -1;
      } else {
        return 1;
      }
    }),
  );
  const { videoSearch } = useSearch();

  async function handleSearch(query: string) {
    const results = await videoSearch(query);
    console.log("Video search response", results);
    if (results) {
      return results.map((r) => ({ ...r, id: r.objectID }));
    }
    return [];
  }

  async function handleSelect(
    playlist: NostrEvent,
    event: AlgoliaVideoResponse[number],
  ) {
    if (!ndk) return;
    try {
      const promise = updateList(ndk, playlist, [
        ["a", `${event.kind}:${event.pubkey}:${event.identifier}`],
      ]);
      toast.promise(promise, {
        loading: "Adding to playlist",
        success: (data) => {
          modal.dismiss();
          return `Video has been added to playlist!`;
        },
        error: "Error",
      });
    } catch (err) {
      console.log("Error adding event", err);
      toast.error("Error adding event");
    }
  }
  return (
    <div className="flex w-full flex-col gap-y-4 overflow-x-hidden">
      {isLoading ? (
        ["", "", ""].map((p) => <LoadingStackedPlaylistCard maxCards={5} />)
      ) : processedPlaylists.length ? (
        processedPlaylists.map((p) => (
          <StackedPlaylistCard
            onAdd={() =>
              modal.show(
                <SearchModal
                  onSelect={(e) => handleSelect(p.rawEvent(), e)}
                  onSearch={handleSearch}
                  searchResultsComponent={(e) => <SearchVideoCard video={e} />}
                  placeholder="Search videos..."
                />,
              )
            }
            playlist={p}
            maxCards={12}
          />
        ))
      ) : (
        <div className="center text-muted-foreground">
          <p className="text-center">No playlists yet!</p>
        </div>
      )}
    </div>
  );
}
