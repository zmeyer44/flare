"use client";
import useUpload from "@/lib/hooks/useUpload";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TextTracksProps = {
  url?: string;
  onChange?: (video: string) => void;
};
export default function TextTracks({ url, onChange }: TextTracksProps) {
  //   const { UploadButton, fileUrl, status } = useUpload({
  //     folderName: "text-tracks",
  //   });

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger>
          <Button variant={"secondary"}>Upload</Button>
        </TooltipTrigger>
        <TooltipContent align="center">
          <p>Coming Soon</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  //   return (
  //     <UploadButton>
  //       <Button loading={status === "uploading"} variant={"secondary"}>
  //         Upload
  //       </Button>
  //     </UploadButton>
  //   );
}
