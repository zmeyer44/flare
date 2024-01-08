import SelectModal from "./select";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import useAuthGuard from "./hooks/useAuthGuard";
import useEvents from "@/lib/hooks/useEvents";
import type { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { getTagValues } from "@/lib/nostr/utils";
import { updateList } from "@/lib/actions/create";
import { useNDK } from "@/app/_providers/ndk";
import { toast } from "sonner";
import { modal } from "@/app/_providers/modal";
import { uniqBy } from "ramda";

type AddToPlaylistModal = {
  eventIdentifier: string;
};
export default function AddToPlaylistModal({
  eventIdentifier,
}: AddToPlaylistModal) {
  useAuthGuard();
  const { currentUser } = useCurrentUser();
  const { events: userPlaylists, isLoading: loadingPlaylists } = useEvents({
    filter: {
      authors: [currentUser!.pubkey],
      kinds: [30005 as NDKKind],
    },
  });
  const processedPlaylists = uniqBy(
    (e) => e.tagId(),
    userPlaylists.sort((a, b) => {
      if (!a.created_at || !b.created_at) return 0;
      if (a.created_at > b.created_at) {
        return -1;
      } else {
        return 1;
      }
    }),
  );
  const { ndk } = useNDK();

  async function handleUpdateList(playlist: NDKEvent) {
    if (!ndk) return;
    try {
      const promise = updateList(ndk, playlist.rawEvent(), [
        ["a", eventIdentifier],
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
    <SelectModal
      options={userPlaylists}
      loadingOptions={loadingPlaylists}
      getKeyAndLabel={(e) => ({
        key: e.tagId(),
        label: getTagValues("title", e.tags) ?? e.id,
      })}
      onSelect={(p) => handleUpdateList(p)}
      title="Select a playlist"
      description="This video will be added to the chosen playlist"
    />
  );
}
