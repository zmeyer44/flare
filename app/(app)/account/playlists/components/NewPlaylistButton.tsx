"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiAddLine } from "react-icons/ri";
import { modal } from "@/app/_providers/modal";
import NewPlaylistModal from "@/components/modals/newPlaylist";

export default function UploadButton() {
  return (
    <Button
      onClick={() => modal.show(<NewPlaylistModal />)}
      className="gap-x-2"
    >
      Create new <RiAddLine className="h-5 w-5" />
    </Button>
  );
}
