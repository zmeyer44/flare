"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useConfig } from "@/lib/hooks/useConfig";
import { copyText } from "@/lib/utils";
import { modal } from "@/app/_providers/modal";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import useUploadVideo from "@/lib/hooks/useUploadVideo";
import { RiUploadCloud2Line } from "react-icons/ri";

type UploadModalProps = {
  title?: string;
  accept?: string;
  folderName?: string;
  acceptText?: string;
  onSumbit: (props: {
    fileUrl: string;
    fileType: string;
    fileHash?: string;
    fileSize?: number;
    duration?: number;
    thumbnailUrl?: string;
  }) => void;
  generateThumbnail?: boolean;
};

export default function UploadModal({
  title = "Upload file",
  acceptText,
  accept,
  generateThumbnail,
  folderName,
  onSumbit,
}: UploadModalProps) {
  const { loginWithPubkey, currentUser } = useCurrentUser();
  const {
    ThumbnailPreview,
    clear,
    UploadButton,
    fileUrl,
    fileType,
    fileSize,
    videoDuration: duration,
    thumbnailUrl,
    imagePreview,
    fileHash,
    status,
  } = useUploadVideo({
    accept,
    folderName,
    generateThumbnail,
  });

  function handleSubmit() {
    if (!fileUrl || !fileType) return;
    onSumbit({
      fileUrl,
      fileType,
      fileHash,
      thumbnailUrl,
      duration,
      fileSize,
    });
    modal.dismiss();
  }

  return (
    <div className="px-5">
      <div className="flex">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>
      <div className="w-full space-y-4 bg-background pt-5">
        {thumbnailUrl ? (
          <ThumbnailPreview />
        ) : (
          <UploadButton className="w-full">
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-foreground/25 px-6 py-10">
              <div className="text-center">
                <RiUploadCloud2Line
                  className="mx-auto h-12 w-12 text-muted-foreground"
                  aria-hidden="true"
                />
                <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                  <span className="relative rounded-md font-semibold text-foreground focus-within:outline-none">
                    Upload a file
                  </span>

                  <p className="pl-1">or drag and drop</p>
                </div>
                {!!acceptText && (
                  <p className="text-xs leading-5 text-muted-foreground">
                    {acceptText}
                  </p>
                )}
              </div>
            </div>
          </UploadButton>
        )}
        <Button
          className="w-full"
          disabled={!fileUrl || status !== "success"}
          loading={status === "uploading"}
          onClick={handleSubmit}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
}
