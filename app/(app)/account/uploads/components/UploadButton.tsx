"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/app/_providers/modal/provider";
import { RiVideoAddLine } from "react-icons/ri";
import UploadModal from "@/components/modals/upload";
import { useNDK } from "@/app/_providers/ndk";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { createEvent } from "@/lib/actions/create";
import { toast } from "sonner";

export default function UploadButton() {
  const modal = useModal();
  const [loading, setLoading] = useState(false);
  const { ndk } = useNDK();
  const { currentUser } = useCurrentUser();

  async function handleSubmit(
    fileUrl: string,
    fileType: string,
    fileHash?: string,
    thumbnailUrl?: string,
  ) {
    console.log("At handle submit");
    if (!ndk || !currentUser) return;
    console.log("Past barrier");
    setLoading(true);
    try {
      const tags: string[][] = [
        ["url", fileUrl],
        ["m", fileType],
      ];
      const uploadCaption = "";

      if (fileHash) {
        tags.push(["x", fileHash]);
      }
      if (thumbnailUrl) {
        tags.push(["thumb", thumbnailUrl]);
        tags.push(["image", thumbnailUrl]);
      }
      const preEvent = {
        content: uploadCaption,
        pubkey: currentUser.pubkey,
        tags: tags,
        kind: 1063,
      };
      const event = await createEvent(ndk, preEvent);
      if (event) {
        console.log("Event", event);
        toast.success("File uploaded Created!");
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
    <Button
      loading={loading}
      onClick={() => {
        modal?.show(
          <UploadModal
            accept="video/*"
            folderName="video"
            generateThumbnail={true}
            onSumbit={(...props) => void handleSubmit(...props)}
          />,
        );
      }}
      className="gap-x-2"
    >
      Upload <RiVideoAddLine className="h-5 w-5" />
    </Button>
  );
}
