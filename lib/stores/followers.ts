import { create } from "zustand";
import type { NDKUserProfile } from "@nostr-dev-kit/ndk";
import { uniq } from "ramda";

interface UsersState {
  followers: Map<string, string[]>;
  addFollowers: (pubkey: string, followers: string[]) => void;
}
const followersStore = create<UsersState>()((set) => ({
  followers: new Map<string, string[]>(),
  addFollowers: (pubkey, followers) =>
    set((state) => ({
      ...state,
      followers: new Map(state.followers).set(
        pubkey,
        uniq([...(state.followers.get(pubkey) ?? []), ...followers]),
      ),
    })),
}));

export default followersStore;
