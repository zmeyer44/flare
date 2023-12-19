"use client";
import useUpload from "@/lib/hooks/useUpload";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

type ThumbnailProps = {
  url?: string;
  onChange: (video: string) => void;
};
export default function Thumbnail({ url, onChange }: ThumbnailProps) {
  const { UploadButton, fileUrl, status } = useUpload({
    folderName: "thumbnails",
  });

  useEffect(() => {
    if (status === "success" && fileUrl) {
      onChange(fileUrl);
    }
  }, [status]);

  if (url) {
    return (
      <div className="">
        <div className={cn("relative overflow-hidden rounded-xl")}>
          <div className="">
            <Image
              alt="Image"
              height="288"
              width="288"
              src={url}
              unoptimized
              className={cn(
                "bg-bckground h-full rounded-xl object-cover object-center",
              )}
            />
          </div>
          <UploadButton>
            <Button
              loading={status === "uploading"}
              className="absolute right-1 top-1 font-semibold"
              variant={"secondary"}
              size={"sm"}
            >
              Change
            </Button>
          </UploadButton>
        </div>
      </div>
    );
  }

  return (
    <UploadButton>
      <Button loading={status === "uploading"} variant={"secondary"}>
        Upload
      </Button>
    </UploadButton>
  );
}
