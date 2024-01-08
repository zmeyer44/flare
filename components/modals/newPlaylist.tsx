"use client";

import { useState } from "react";

import useAuthGuard from "./hooks/useAuthGuard";
import { modal } from "@/app/_providers/modal";
import { useNDK } from "@/app/_providers/ndk";
import { type NostrEvent } from "@nostr-dev-kit/ndk";
import { toast } from "sonner";
import { createEvent } from "@/lib/actions/create";
import FormModal from "./formModal";
import { z } from "zod";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";

type NewPlaylistModalProps = {
  eventToAdd?: NostrEvent;
  onClose?: () => void;
};

const CreatePlaylistSchema = z.object({
  title: z.string(),
  image: z.string().optional(),
  description: z.string().optional(),
});
type CreatePlaylistType = z.infer<typeof CreatePlaylistSchema>;

export default function NewPlaylistModal({
  eventToAdd,
  onClose,
  ...props
}: NewPlaylistModalProps) {
  const router = useRouter();
  useAuthGuard();
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const { ndk } = useNDK();

  async function handleCreatePlaylist(data: CreatePlaylistType) {
    setIsLoading(true);
    const random = nanoid(7);
    const tags = [
      ["title", data.title],
      ["name", data.title],
      ["d", random],
    ];
    if (data.description) {
      tags.push(["description", data.description]);
      tags.push(["summary", data.description]);
    }
    if (data.image) {
      tags.push(["image", data.image]);
      tags.push(["picture", data.image]);
    }
    const event = await createEvent(ndk!, {
      content: "",
      kind: 30005,
      tags: tags,
    });

    setIsLoading(false);
    if (event) {
      toast.success("List Created!");
      if (onClose) {
        onClose();
      } else {
        modal?.dismiss();
        router.push(`/playlist/${event.encode()}`);
      }
    } else {
      toast.error("An error occured");
    }
  }

  return (
    <FormModal
      title={"Create Playlist"}
      fields={[
        {
          label: "Title",
          type: "input",
          slug: "title",
        },
        {
          label: "Description",
          type: "text-area",
          slug: "description",
        },
        {
          label: "Cover Image",
          type: "upload",
          placeholder: "Upload Image",
          slug: "image",
        },
      ]}
      formSchema={CreatePlaylistSchema}
      onSubmit={handleCreatePlaylist}
      isSubmitting={isLoading}
      cta={{
        text: "Create Playlist",
      }}
    />
  );
}
