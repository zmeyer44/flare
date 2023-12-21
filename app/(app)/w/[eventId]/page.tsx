import { Metadata, ResolvingMetadata } from "next";
import { nip19 } from "nostr-tools";
import PlaybackPage from "./PlaybackPage";
import { getVideo } from "@/lib/server-actions/video/get";
import { syncViews } from "@/lib/server-actions/video/viewSync";

export async function generateMetadata(
  {
    params,
  }: {
    params: { eventId: string };
  },
  parent: ResolvingMetadata,
): Promise<Metadata | null | undefined> {
  const { data, type } = nip19.decode(params.eventId);
  if (type !== "naddr") {
    throw new Error("Invalid event");
  }
  try {
    const video = await getVideo(data);
    const title = video.title ?? "Video on Flare";
    const description =
      video.summary ??
      "Flare is the next era of video streaming. You host your own content, post it to Nostr, and share it with the world. There's nothing the Commies can do about it";

    const image = video.thumbnail ?? "";
    return {
      title: title,
      openGraph: {
        title: title,
        description: description,
        images: [image],
      },
      twitter: {
        title: title,
        description: description,
        images: [image],
        card: "summary_large_image",
        creator: "@zachmeyer_",
      },
    };
  } catch (err) {
    console.log("Error generating metadata");
  } finally {
    console.log("Running finially");
    void syncViews({
      naddr: params.eventId,
    });
  }
}

export default function VideoPage({
  params: { eventId },
}: {
  params: {
    eventId: string;
  };
}) {
  const { data, type } = nip19.decode(eventId);
  if (type !== "naddr") {
    throw new Error("Invalid event");
  }

  return <PlaybackPage {...data} />;
}
