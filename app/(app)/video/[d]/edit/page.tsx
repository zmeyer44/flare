"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { nip19 } from "nostr-tools";
import type { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import useProfile from "@/lib/hooks/useProfile";
import { getTagValues } from "@/lib/nostr/utils";
import Player, { VideoUpload } from "../../components/Player";
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
import Thumbnail from "../../components/thumbnail";
import TextTracks from "../../components/textTracks";
import { RiAlertLine } from "react-icons/ri";
import useEvents from "@/lib/hooks/useEvents";
import Spinner from "@/components/spinner";
import EditVideoPage from "./EditVideoPage";

type EditVideoPageProps = {
  d: string;
};

export default function Page({ params }: { params: EditVideoPageProps }) {
  const router = useRouter();
  const { fetchEvents, ndk } = useNDK();
  const { currentUser } = useCurrentUser();
  const [event, setEvent] = useState<NDKEvent>();
  useEffect(() => {
    if (ndk) {
      handleFetchEvent();
    }
  }, [ndk, params.d]);
  async function handleFetchEvent() {
    const events = await fetchEvents({
      kinds: [34235],
      authors: [currentUser?.pubkey as string],
      ["#d"]: [params.d],
      limit: 1,
    });
    if (events.length) {
      setEvent(events[0]);
    }
  }

  if (!event) {
    return (
      <div className="center py-10">
        <Spinner />
      </div>
    );
  }
  return <EditVideoPage event={event} />;
}
