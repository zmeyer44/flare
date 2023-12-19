import { create } from "zustand";
import type { NDKEvent } from "@nostr-dev-kit/ndk";
import { getTagValues } from "../nostr/utils";

type VideoEvent = NDKEvent & {
  views?: Set<NDKEvent>;
};

interface VideosState {
  videos: Map<string, VideoEvent>;
  addVideo: (event: VideoEvent) => void;
  views: Set<NDKEvent>;
  addViews: (events: NDKEvent[]) => void;
}

const videosStore = create<VideosState>()((set) => ({
  videos: new Map<string, VideoEvent>(),
  addVideo: (video) =>
    set((state) => ({
      ...state,
      videos: new Map(state.videos).set(video.tagId(), video),
    })),
  views: new Set<NDKEvent>(),
  addViews: (views) => {
    const videoKey = getTagValues("a", views[0]!.tags);
    if (!videoKey) return;
    return set((state) => {
      const video = state.videos.get(videoKey);
      if (!video) {
        console.log("cant find video", videoKey, state.videos.has(videoKey));
        return state;
      }
      return {
        ...state,
        videos: new Map(state.videos).set(videoKey, {
          ...video,
          views: video?.views
            ? new Set([...Array.from(video.views), ...views])
            : new Set(views),
        } as VideoEvent),
        views: new Set([...Array.from(state.views), ...views]),
      };
    });
  },
}));

export default videosStore;
