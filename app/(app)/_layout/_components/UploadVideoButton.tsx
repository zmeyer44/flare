"use client";
import { modal } from "@/app/_providers/modal";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import AuthModal from "@/components/modals/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RiAddFill } from "react-icons/ri";
import { useRouter } from "next/navigation";

export default function ZapButton() {
  const { currentUser } = useCurrentUser();
  const router = useRouter();
  return (
    <div className="center relative w-full">
      <Button
        onClick={() => {
          if (currentUser) {
            router.push("/new-video");
          } else {
            modal.show(<AuthModal />, {
              id: "auth",
            });
          }
        }}
        size="icon"
        className={cn(
          "center group relative min-h-[48px] min-w-[48px] rounded-lg",
        )}
      >
        <RiAddFill className={cn("h-6 w-6 shrink-0")} aria-hidden="true" />
      </Button>
    </div>
  );
}
