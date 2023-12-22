import { create } from "zustand";
import type { NDKUser } from "@nostr-dev-kit/ndk";

type Settings = {};

interface CurrentUserState {
  currentUser: NDKUser | null;
  follows: Set<NDKUser>;
  fetchingFollows: boolean;
  setFetchingFollows: (s: boolean) => void;
  settings: Settings;
  setCurrentUser: (user: NDKUser | null) => void;
  updateCurrentUser: (user: Partial<NDKUser>) => void;
  setFollows: (follows: Set<NDKUser>) => void;
  addFollow: (follow: NDKUser) => void;
}

const currentUserStore = create<CurrentUserState>()((set) => ({
  currentUser: null,
  follows: new Set(),
  fetchingFollows: false,
  setFetchingFollows: (s) => set((state) => ({ ...state, fetchingFollows: s })),
  settings: {},
  setCurrentUser: (user) => set((state) => ({ ...state, currentUser: user })),
  updateCurrentUser: (user) =>
    set((state) => ({
      ...state,
      currentUser: { ...state.currentUser, ...user } as NDKUser,
    })),
  setFollows: (follows) => set((state) => ({ ...state, follows: follows })),
  addFollow: (follow) =>
    set((state) => ({ ...state, follows: new Set(state.follows).add(follow) })),
}));

export default currentUserStore;
