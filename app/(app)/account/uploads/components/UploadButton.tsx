"use client";
import { useState } from "react";
import Link from "next/link";
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

  return (
    <Link href={`/new-video`}>
      <Button loading={loading} className="gap-x-2">
        Upload <RiVideoAddLine className="h-5 w-5" />
      </Button>
    </Link>
  );
}
