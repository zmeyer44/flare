"use client";

import { useState, useEffect } from "react";
import { useNDK } from "@/app/_providers/ndk";
import useEvents from "./useEvents";
import useCurrentUser from "./useCurrentUser";
import type { NDKKind, NDKEvent } from "@nostr-dev-kit/ndk";
import { createEvent } from "@/lib/actions/create";
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
export default function useVideos({
  eventIdentifier,
}: {
  eventIdentifier: string;
}) {
  const [shouldAddView, setShouldAddView] = useState(false);
  const [requestingView, setRequestingView] = useState(false);
  const [video, setVideo] = useState<NDKEvent>();
  const { ndk } = useNDK();
  const { currentUser } = useCurrentUser();
  const { events: viewEvents } = useEvents({
    filter: {
      kinds: [34237 as NDKKind],
      ["#a"]: [eventIdentifier],
    },
  });

  useEffect(() => {
    if (ndk && !video) {
      console.log("Fetching video");
      handleFetchVideo();
    }
  }, [eventIdentifier, ndk]);

  async function handleFetchVideo() {
    if (!ndk) return;
    const [kind, pubkey, d] = eventIdentifier.split(":");

    if (!kind || !pubkey || !d) return;
    const video = await ndk?.fetchEvent({
      kinds: [parseInt(kind) as NDKKind],
      authors: [pubkey],
      ["#d"]: [d],
    });
    console.log("Video", video);
    if (video) {
      setVideo(video);
    }
  }

  useEffect(() => {
    if (
      shouldAddView &&
      ndk &&
      currentUser &&
      eventIdentifier &&
      !requestingView
    ) {
      setRequestingView(true);
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
    views: viewEvents,
    video: video,
  };
}
