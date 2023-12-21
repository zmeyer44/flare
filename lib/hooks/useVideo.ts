"use client";

import { useState, useEffect } from "react";
import { useNDK } from "@/app/_providers/ndk";
import useEvents from "./useEvents";
import useCurrentUser from "./useCurrentUser";
import type { NDKKind, NDKEvent } from "@nostr-dev-kit/ndk";
import { createEvent } from "@/lib/actions/create";
import { getTagValues } from "@/lib/nostr/utils";
import { unixTimeNowInSeconds } from "../nostr/dates";
import { api } from "../trpc/api";
import { nip19 } from "nostr-tools";

// import videosStore from "../stores/videos";

// export default function useVideos({
//   eventIdentifier,
// }: {
//   eventIdentifier: string;
// }) {
//   const { addViews, videos, addVideo } = videosStore();
//   const [shouldAddView, setShouldAddView] = useState(false);
//   const [requestingView, setRequestingView] = useState(false);
//   const { ndk } = useNDK();
//   const { currentUser } = useCurrentUser();
//   const { events: viewEvents } = useEvents({
//     filter: {
//       kinds: [34237 as NDKKind],
//       ["#a"]: [eventIdentifier],
//     },
//   });

//   useEffect(() => {
//     console.log("Has video", eventIdentifier, videos.has(eventIdentifier));

//     if (ndk && !videos.has(eventIdentifier)) {
//       console.log("Fetching video");
//       handleFetchVideo();
//     }
//   }, [eventIdentifier, ndk]);

//   useEffect(() => {
//     if (videos.has(eventIdentifier) && viewEvents.length) {
//       console.log("Adding views", viewEvents.length);
//       addViews(viewEvents);
//     }
//   }, [viewEvents, videos]);

//   async function handleFetchVideo() {
//     if (!ndk) return;
//     const [kind, pubkey, d] = eventIdentifier.split(":");
//     console.log("Fetching", kind, pubkey, d);
//     if (!kind || !pubkey || !d) return;
//     const video = await ndk?.fetchEvent({
//       kinds: [parseInt(kind) as NDKKind],
//       authors: [pubkey],
//       ["#d"]: [d],
//     });
//     console.log("Video", video);
//     if (video) {
//       addVideo(video);
//     }
//   }

//   useEffect(() => {
//     if (
//       shouldAddView &&
//       ndk &&
//       currentUser &&
//       eventIdentifier &&
//       !requestingView
//     ) {
//       setRequestingView(true);
//       recordView();
//     }
//   }, [currentUser, ndk, shouldAddView]);
//   async function recordView() {
//     if (!ndk || !currentUser) return;
//     try {
//       let viewEvent: NDKEvent | null | boolean = await ndk.fetchEvent({
//         authors: [currentUser.pubkey],
//         kinds: [34237 as NDKKind],
//         ["#a"]: [eventIdentifier],
//       });
//       if (!viewEvent) {
//         viewEvent = await createEvent(ndk, {
//           content: "",
//           kind: 34237,
//           tags: [
//             ["a", eventIdentifier],
//             ["d", eventIdentifier],
//             ["viewed", "0"],
//           ],
//         });
//       }
//       if (viewEvent) {
//         addViews([viewEvent]);
//       }
//     } catch (err) {
//       console.log("Error recoring view");
//     }
//   }
//   return {
//     addView: () => setShouldAddView(true),
//     views: videos.get(eventIdentifier)?.views,
//     video: videos.get(eventIdentifier),
//     videos: videos,
//   };
// }

type VideoType = {
  url: string;
  thumbnail: string;
  title: string;
  publishedAt: number;
  author: string;
};
export default function useVideo({
  eventIdentifier,
  event: _event,
}: {
  eventIdentifier: string;
  event?: NDKEvent;
}) {
  const [shouldAddView, setShouldAddView] = useState(false);
  const [requestedView, setRequestedView] = useState(false);
  const [event, setEvent] = useState<NDKEvent | undefined>(_event);
  const { ndk } = useNDK();
  const { currentUser } = useCurrentUser();
  // const { events: viewEvents } = useEvents({
  //   filter: {
  //     kinds: [34237 as NDKKind],
  //     ["#a"]: [eventIdentifier],
  //   },
  // });
  const [kind, pubkey, d] = eventIdentifier.split(":") as [
    number,
    string,
    string,
  ];
  const { data: voteCount } = api.view.getCount.useQuery({
    d: d,
    kind: kind,
    pubkey: pubkey,
  });

  useEffect(() => {
    if (ndk && !event) {
      handleFetchVideo();
    }
  }, [eventIdentifier, ndk]);

  async function handleFetchVideo() {
    if (!ndk) return;
    const [kind, pubkey, d] = eventIdentifier.split(":");
    if (!kind || !pubkey || !d) return;
    const videoEvent = await ndk?.fetchEvent({
      kinds: [parseInt(kind) as NDKKind],
      authors: [pubkey],
      ["#d"]: [d],
    });
    console.log("Video", videoEvent);
    if (videoEvent) {
      setEvent(videoEvent);
    }
  }

  useEffect(() => {
    if (
      shouldAddView &&
      ndk &&
      currentUser &&
      eventIdentifier &&
      !requestedView
    ) {
      console.log("requesting view", requestedView);
      setRequestedView(true);
      recordView();
    }
  }, [currentUser, ndk, shouldAddView]);

  async function recordView() {
    if (!ndk || !currentUser) return;
    try {
      let viewEvent: NDKEvent | null | boolean = await ndk.fetchEvent({
        authors: [currentUser.pubkey],
        kinds: [34237 as NDKKind],
        ["#a"]: [eventIdentifier],
      });
      if (!viewEvent) {
        viewEvent = await createEvent(ndk, {
          content: "",
          kind: 34237,
          tags: [
            ["a", eventIdentifier],
            ["d", eventIdentifier],
            ["viewed", "0"],
          ],
        });
      }
    } catch (err) {
      console.log("Error recoring view");
    }
  }
  return {
    addView: () => setShouldAddView(true),
    // views: viewEvents,
    viewCount: voteCount ?? 0,
    video: event ? getVideoDetails(event) : null,
    event: event,
  };
}

export function getVideoDetails(event: NDKEvent) {
  const url = getTagValues("url", event.tags) ?? "";
  return {
    url: url,
    author: event.author.pubkey,
    publishedAt: parseInt(
      getTagValues("published_at", event.tags) ??
        event.created_at?.toString() ??
        unixTimeNowInSeconds().toString(),
    ),
    thumbnail:
      getTagValues("thumb", event.tags) ??
      getTagValues("thumbnail", event.tags) ??
      getTagValues("image", event.tags) ??
      (url.includes("youtu")
        ? `http://i3.ytimg.com/vi/${
            url.includes("/youtu.be/")
              ? url.split("youtu.be/").pop()
              : url.split("?v=").pop()
          }/hqdefault.jpg`
        : ""),
    title: getTagValues("title", event.tags) ?? "Untitled",
    summary:
      getTagValues("summary", event.tags) ??
      getTagValues("about", event.tags) ??
      (event.content as string),
  };
}
