"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { nip19 } from "nostr-tools";
import type { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import useProfile from "@/lib/hooks/useProfile";
import { getTagValues } from "@/lib/nostr/utils";
import Player, { VideoUpload } from "./components/Player";
import { Textarea } from "@/components/ui/textarea";
import useAutosizeTextArea from "@/lib/hooks/useAutoSizeTextArea";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNDK } from "@/app/_providers/ndk";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { createEvent } from "@/lib/actions/create";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";
import { nanoid } from "nanoid";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import Thumbnail from "./components/thumbnail";
import TextTracks from "./components/textTracks";
import { RiAlertLine } from "react-icons/ri";

export default function Page() {
  const router = useRouter();
  const { ndk } = useNDK();
  const { currentUser } = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState<{
    url?: string;
    title?: string;
    summary?: string;
    thumbnail?: string;
    fileType?: string;
    fileHash?: string;
    fileSize?: number;
    duration?: number;
    hashtags?: string;
    contentWarning?: string;
  }>({});

  const titleRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(titleRef.current, videoData?.title ?? "");
  const summaryRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(summaryRef.current, videoData?.summary ?? "");

  async function handleSubmit() {
    if (!ndk || !currentUser) return;
    if (!videoData?.url || !videoData?.title) return;

    setLoading(true);
    try {
      const d = nanoid(7);
      const tags: string[][] = [
        ["d", d],
        ["url", videoData.url],
        ["title", videoData.title],
        ["summary", videoData.summary ?? ""],
        ["published_at", unixTimeNowInSeconds().toString()],
        ["client", "flare"],
        [
          "alt",
          `This is a video event and can be viewed at ${
            process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "https://www.flare.pub"
          }/w/${nip19.naddrEncode({
            identifier: d,
            kind: 34235,
            pubkey: currentUser.pubkey,
          })}`,
        ],
      ];

      if (videoData.fileType) {
        tags.push(["m", videoData.fileType]);
      }
      if (videoData.fileHash) {
        tags.push(["x", videoData.fileHash]);
      }
      if (videoData.fileSize) {
        tags.push(["size", videoData.fileSize.toString()]);
      }
      if (videoData.duration) {
        tags.push(["duration", videoData.duration.toString()]);
      }

      if (videoData.thumbnail) {
        tags.push(["thumb", videoData.thumbnail]);
        tags.push(["image", videoData.thumbnail]);
      }

      if (videoData.contentWarning) {
        tags.push(["content-warning", videoData.contentWarning]);
      }
      if (videoData.hashtags) {
        const hashtags = videoData.hashtags.split(",").map((t) => t.trim());
        for (const hashtag of hashtags) {
          tags.push(["t", hashtag]);
        }
      }

      const preEvent = {
        content: videoData.summary ?? "",
        pubkey: currentUser.pubkey,
        tags: tags,
        kind: 34235,
      };
      const event = await createEvent(ndk, preEvent);
      if (event) {
        console.log("Event", event);
        toast.success("Video published!");
        const encodedEvent = event.encode();
        router.push(`/w/${encodedEvent}`);
      } else {
        toast.error("An error occured");
      }
    } catch (err) {
      console.log("error submitting event");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="shrink-1 flex-1 md:min-w-[500px]">
        {/* Video Player */}
        <div className="w-full rounded-xl">
          {videoData?.url ? (
            <Player
              url={videoData.url}
              title={videoData.title}
              image={videoData.thumbnail}
            />
          ) : (
            <VideoUpload setVideo={setVideoData} />
          )}
        </div>
        <div className="space-y-2.5 py-3">
          <Textarea
            ref={titleRef}
            value={videoData?.title}
            onChange={(e) =>
              setVideoData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Untitled video"
            autoFocus
            className={cn(
              "invisible-input text-4xl font-medium text-foreground placeholder:text-muted-foreground/70",
            )}
          />
          <div className={cn("rounded-xl bg-muted p-3")}>
            <Textarea
              ref={summaryRef}
              value={videoData?.summary}
              onChange={(e) =>
                setVideoData((prev) => ({ ...prev, summary: e.target.value }))
              }
              placeholder="Enter video summary"
              className={cn(
                "invisible-input min-h-[50px] text-base font-medium text-foreground placeholder:text-muted-foreground/70",
              )}
            />
          </div>
          <div className="flex items-center gap-x-2 py-3">
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger>
                  <Button variant={"outline"} disabled>
                    Save as Draft
                  </Button>
                </TooltipTrigger>
                <TooltipContent align="center">
                  <p>Coming Soon</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              onClick={handleSubmit}
              loading={loading}
              disabled={!videoData?.url || !videoData?.title}
            >
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* This can be a form or something */}
      <div className="w-full space-y-3 lg:max-w-[400px]">
        <div
          className={cn(
            "flex items-center justify-between rounded-lg border p-2",
            videoData?.thumbnail && "flex-col items-start gap-y-2",
          )}
        >
          <Label className="font-semibold">Thumbnail image</Label>
          <Thumbnail
            url={videoData?.thumbnail}
            onChange={(newThumbnailUrl) => {
              setVideoData((prev) => ({ ...prev, thumbnail: newThumbnailUrl }));
            }}
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-2">
          <Label className="font-semibold">Text tracks</Label>
          <TextTracks />
        </div>
        <div className="flex flex-col gap-y-2 rounded-lg border p-2">
          <Label className="mb-1 font-semibold">Hashtags</Label>
          <Textarea
            value={videoData?.hashtags}
            onChange={(e) =>
              setVideoData((prev) => ({
                ...prev,
                hashtags: e.target.value,
              }))
            }
            placeholder="Bitcoin, Nostr, Entertainment"
          />
        </div>
        <div className="flex flex-col gap-y-2 rounded-lg border p-2">
          <Label className="mb-1 font-semibold">Content warning</Label>
          <Textarea
            value={videoData?.contentWarning}
            onChange={(e) =>
              setVideoData((prev) => ({
                ...prev,
                contentWarning: e.target.value,
              }))
            }
          />
        </div>
        <div className="flex flex-col gap-y-2 rounded-lg border bg-muted p-2 text-muted-foreground transition-colors hover:text-yellow-500">
          <div className="flex items-center gap-x-1">
            <RiAlertLine className="h-4 w-4" />
            <Label className="font-semibold">Disclaimer</Label>
          </div>
          <p className="text-sm">
            By using this service, you confirm that this video belongs to you or
            that you have the right to publish it.
          </p>
        </div>
      </div>
    </div>
  );
}
