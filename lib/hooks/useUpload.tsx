"use client";
import { useState, ReactNode, useRef } from "react";
import Image from "next/image";
import { z } from "zod";
import { createZodFetcher } from "zod-fetch";
import { cn } from "@/lib/utils";
import Spinner from "@/components/spinner";
import { HiX } from "react-icons/hi";
import { nanoid } from "nanoid";

const fetchWithZod = createZodFetcher();

const PresignedPostSchema = z.object({
  url: z.string(),
  fileName: z.string(),
});
type UploadProps = {
  folderName?: string;
  accept?: string;
  generateThumbnail?: boolean;
};
const useUpload = (props?: UploadProps) => {
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers
  const {
    folderName,
    accept = "image/png, image/jpeg, image/webp",
    generateThumbnail = false,
  } = props ?? {};

  const [status, setStatus] = useState<
    "empty" | "uploading" | "success" | "error"
  >("empty");

  const [fileUrl, setFileUrl] = useState<string | undefined>();
  const [fileType, setFileType] = useState<string | undefined>();
  const [fileHash, setFileHash] = useState<string | undefined>();
  const [fileSize, setFileSize] = useState<number | undefined>();
  const [videoDuration, setVideoDuration] = useState<number | undefined>();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>();
  const [imagePreview, setImagePreview] = useState<string | undefined>();

  const uploadImage = async (file: File, folderName?: string) => {
    if (!file) return;

    try {
      const presignedPost = await fetchWithZod(
        // The schema you want to validate with
        PresignedPostSchema,
        // Any parameters you would usually pass to fetch
        "/api/upload",
        {
          method: "POST",
          body: JSON.stringify({
            folderName,
            fileType: file.type,
            fileName: file.name,
            fileSize: file.size,
          }),
        },
      );

      const { url, fileName } = presignedPost;

      if (!url) return;

      const result = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (result.ok) {
        setStatus("success");
        const fileUrl = `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${fileName}`;
        setFileUrl(fileUrl);
        setImagePreview(fileUrl);
        return fileUrl;
      }
      return;
    } catch (err) {
      setStatus("error");
      console.log("ERROR", err);
    }
  };

  function getVideoThumbnail(file: File, seekTo = 2.0) {
    console.log("getting video cover for file: ", file);
    return new Promise((resolve, reject) => {
      // load the file to a video player
      const videoPlayer = document.createElement("video");
      videoPlayer.setAttribute("src", URL.createObjectURL(file));
      videoPlayer.load();
      videoPlayer.addEventListener("error", (ex) => {
        reject("error when loading video file");
      });
      // load metadata of the video to get video duration and dimensions
      videoPlayer.addEventListener("loadedmetadata", () => {
        // seek to user defined timestamp (in seconds) if possible
        const durationInSeconds = videoPlayer.duration;
        setVideoDuration(durationInSeconds);
        if (durationInSeconds < seekTo) {
          seekTo = 0;
        }

        // delay seeking or else 'seeked' event won't fire on Safari
        setTimeout(() => {
          videoPlayer.currentTime = seekTo;
        }, 200);
        // extract video thumbnail once seeking is complete
        videoPlayer.addEventListener("seeked", () => {
          console.log("video is now paused at %ss.", seekTo);
          // define a canvas to have the same dimension as the video
          const canvas = document.createElement("canvas");
          canvas.width = videoPlayer.videoWidth;
          canvas.height = videoPlayer.videoHeight;
          // draw the video frame to canvas
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            console.log("no ctx");
            return;
          }
          ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
          // return the canvas image as a blob
          ctx.canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            "image/jpeg",
            0.75 /* quality */,
          );
        });
      });
    });
  }
  const handleGenerateThumbnail = async (video: File) => {
    const imageBlob = (await getVideoThumbnail(video)) as Blob | undefined;
    if (!imageBlob) {
      console.log("Unable to create thumbnail");
      return;
    }
    const thumbnailFile = new File([imageBlob], `${nanoid(5)}-thumbnail.jpg`, {
      type: "image/jpeg",
    });
    console.log("Thumbnail File:", thumbnailFile);
    // Handle the thumbnail file as needed
    try {
      const presignedPost = await fetchWithZod(
        // The schema you want to validate with
        PresignedPostSchema,
        // Any parameters you would usually pass to fetch
        "/api/upload",
        {
          method: "POST",
          body: JSON.stringify({
            folderName: folderName ? folderName + `/thumbnails` : "thumbnails",
            fileType: "image/jpeg",
            fileName: thumbnailFile.name,
            fileSize: thumbnailFile.size,
          }),
        },
      );

      const { url, fileName } = presignedPost;

      if (!url) {
        console.log("Error generating presigned thumbnail url");
        return;
      }

      const result = await fetch(url, {
        method: "PUT",
        body: thumbnailFile,
        headers: {
          "Content-Type": thumbnailFile.type,
        },
      });
      if (result.ok) {
        const fileUrl = `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${fileName}`;
        setThumbnailUrl(fileUrl);
        return fileUrl;
      }
      return;
    } catch (err) {
      console.log("ERROR generating thumbnail", err);
    }
  };

  const onImageChange = (e: React.FormEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    setStatus("uploading");
    uploadImage(file, folderName);
    setFileType(file.type);
    setFileSize(file.size);
    if (generateThumbnail) {
      handleGenerateThumbnail(file);
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (readerEvent) => {
      const dataUrl = readerEvent?.target?.result as string;
      setImagePreview(dataUrl);
    };

    const hasher = new FileReader();
    hasher.readAsArrayBuffer(file);
    hasher.onload = async (event) => {
      const arrayBuffer = event.target?.result;
      if (!arrayBuffer) return;

      // Generate SHA-256 hash of the file
      try {
        const hashBuffer = await crypto.subtle.digest(
          "SHA-256",
          arrayBuffer as ArrayBuffer,
        );
        const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""); // Convert bytes to hex string
        setFileHash(hashHex);
        console.log("SHA-256 Hash:", hashHex); // Log the hash or set it to some state variable
      } catch (error) {
        console.error("Error generating file hash:", error);
      }
    };
  };

  const UploadButton = ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => {
    const inputFileRef = useRef<HTMLInputElement>(null);
    function onButtonClick() {
      if (inputFileRef.current) {
        inputFileRef.current!.click();
      }
    }
    return (
      <>
        <button type="button" className={className} onClick={onButtonClick}>
          {children}
        </button>
        <input
          type="file"
          accept={accept}
          hidden
          onChange={onImageChange}
          ref={inputFileRef}
        />
      </>
    );
  };

  const ImagePreview = ({ className }: { className?: string }) => {
    if (!imagePreview) return null;
    return (
      <div className={cn("relative overflow-hidden rounded-xl", className)}>
        <div className="">
          <Image
            alt="Image"
            height="288"
            width="288"
            src={imagePreview}
            unoptimized
            className={cn(
              "bg-bckground h-full rounded-xl object-cover object-center max-sm:max-h-[100px]",
              status === "uploading" && "grayscale",
              status === "error" && "blur-xl",
            )}
          />
        </div>
        {status === "uploading" && (
          <button className="center absolute left-1 top-1 rounded-full bg-foreground bg-opacity-70 p-1 text-background hover:bg-opacity-100">
            <Spinner />
          </button>
        )}
        {status === "success" && (
          <button
            onClick={clear}
            className="center absolute left-1 top-1 rounded-full bg-foreground bg-opacity-70 p-1 hover:bg-opacity-100"
          >
            <HiX className="block h-4 w-4 text-background" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  };
  const ThumbnailPreview = ({ className }: { className?: string }) => {
    if (!thumbnailUrl) return null;
    return (
      <div className={cn("relative overflow-hidden rounded-xl", className)}>
        <div className="">
          <Image
            alt="Image"
            height="288"
            width="288"
            src={thumbnailUrl}
            unoptimized
            className={cn(
              "bg-bckground h-full rounded-xl object-cover object-center max-sm:max-h-[100px]",
              status === "uploading" && "grayscale",
              status === "error" && "blur-xl",
            )}
          />
        </div>
        {status === "uploading" && (
          <button className="center absolute left-1 top-1 rounded-full bg-foreground bg-opacity-70 p-1 text-background hover:bg-opacity-100">
            <Spinner />
          </button>
        )}
        {status === "success" && (
          <button
            onClick={clear}
            className="center absolute left-1 top-1 rounded-full bg-foreground bg-opacity-70 p-1 hover:bg-opacity-100"
          >
            <HiX className="block h-4 w-4 text-background" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  };

  const clear = () => {
    setStatus("empty");
    setFileUrl(undefined);
    setFileHash(undefined);
    setImagePreview(undefined);
  };

  return {
    imagePreview,
    status,
    fileUrl,
    fileType,
    fileHash,
    fileSize,
    videoDuration,
    thumbnailUrl,
    UploadButton,
    ImagePreview,
    ThumbnailPreview,
    clear,
  };
};

export default useUpload;
