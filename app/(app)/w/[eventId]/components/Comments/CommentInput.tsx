"use client";

import { useState, useRef, useEffect } from "react";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import useAutosizeTextArea from "@/lib/hooks/useAutoSizeTextArea";
import { useModal } from "@/app/_providers/modal/provider";
import { useNDK } from "@/app/_providers/ndk";
import useUpload from "@/lib/hooks/useUpload";
import { toast } from "sonner";
import { createEvent } from "@/lib/actions/create";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn, getTwoLetters, getNameToShow } from "@/lib/utils";
import { HiX, HiOutlinePaperClip } from "react-icons/hi";

export default function CommentInput({
  onNewComment,
  refetch,
  autoFocus,
  onBlur,
  initialTags,
}: {
  onNewComment?: (data: { body: string }) => void;
  refetch?: () => void;
  autoFocus?: boolean;
  onBlur?: () => void;
  initialTags?: string[][];
}) {
  const modal = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");

  const {
    UploadButton,
    ImagePreview,
    clear,
    imagePreview,
    fileUrl,
    status: imageStatus,
  } = useUpload({ folderName: "event" });

  const { ndk } = useNDK();
  const { currentUser } = useCurrentUser();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(contentRef.current, content);

  async function handleSubmit() {
    if (!ndk || !currentUser) return;
    setIsLoading(true);
    try {
      const tags: string[][] = initialTags ?? [];
      let noteContent = content;

      if (fileUrl) {
        tags.push(["r", fileUrl]);
        noteContent += `\n${fileUrl}`;
      }
      const preEvent = {
        content: noteContent,
        pubkey: currentUser.pubkey,
        tags: tags,
        kind: 1,
      };
      const event = await createEvent(ndk, preEvent);
      if (event) {
        toast.success("Comment created!");
        modal?.hide();
      } else {
        toast.error("An error occured");
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex gap-x-4">
      {currentUser && (
        <div className="flex w-[40px] shrink-0 flex-col py-[7px]">
          <Avatar className="center h-[40px] w-[40px] overflow-hidden rounded-[.55rem] bg-muted">
            <AvatarImage
              className="object-cover"
              src={currentUser.profile?.image}
              alt={currentUser.profile?.displayName}
            />
            <AvatarFallback className="text-[9px]">
              {getTwoLetters({
                npub: currentUser.npub,
                profile: currentUser.profile,
              })}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      <div className="hover:text-1 focus-within:border-text w-full flex-1 rounded-lg border focus-within:ring-0">
        <div className="flex w-full items-stretch gap-x-4 p-3 pl-4">
          <div className="w-full space-y-4">
            <div className="">
              <Textarea
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Leave a comment..."
                autoFocus={autoFocus}
                className={cn(
                  "invisible-input min-h-[50px] text-base font-medium text-foreground placeholder:text-muted-foreground/70",
                )}
              />
              <div className="mt-1 w-full">
                <div className="flex w-full items-center justify-between text-muted-foreground">
                  {imagePreview ? (
                    <ImagePreview className="" />
                  ) : (
                    <UploadButton>
                      <Button
                        size={"icon"}
                        variant={"outline"}
                        className="rounded-full"
                      >
                        <HiOutlinePaperClip className="h-4 w-4" />
                      </Button>
                    </UploadButton>
                  )}
                  <div className="center mt-auto">
                    <Button
                      loading={isLoading}
                      onClick={handleSubmit}
                      className=" rounded-full"
                    >
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
