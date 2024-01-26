"use client";

import { useState, useRef } from "react";
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
  const { ndk } = useNDK();
  const { currentUser } = useCurrentUser();
  console.log("Ssearching for ", {
    filter: {
      kinds: [34235],
      authors: [currentUser?.pubkey as string],
      ["#d"]: [params.d],
      limit: 1,
    },
  });
  const { events } = useEvents({
    filter: {
      kinds: [34235],
      authors: [currentUser?.pubkey as string],
      ["#d"]: [params.d],
      limit: 1,
    },
  });
  const eventToEdit = events[0];
  if (events.length === 0 || !eventToEdit) {
    return (
      <div className="center py-10">
        <Spinner />
      </div>
    );
  }
  return <EditVideoPage event={eventToEdit} />;
}
