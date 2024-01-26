"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiVideoAddLine } from "react-icons/ri";

export default function UploadButton() {
  return (
    <Link href={`/video/new`}>
      <Button className="gap-x-2">
        Upload <RiVideoAddLine className="h-5 w-5" />
      </Button>
    </Link>
  );
}
