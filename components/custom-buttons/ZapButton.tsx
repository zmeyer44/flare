"use client";
import { ComponentProps } from "react";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import LoginModal from "@/components/modals/login";
import ZapModal from "@/components/modals/zap";
import { useModal } from "@/app/_providers/modal/provider";
import type { NostrEvent } from "@nostr-dev-kit/ndk";
import { Button } from "@/components/ui/button";

type ZapButtonProps = {
  event: NostrEvent;
} & ComponentProps<typeof Button>;

export default function ZapButton({
  event,
  children = "Zap",
  ...buttonProps
}: ZapButtonProps) {
  const { currentUser } = useCurrentUser();
  const modal = useModal();

  return (
    <Button
      onClick={() => {
        if (!currentUser) {
          modal?.show(<LoginModal />);
        } else {
          modal?.show(<ZapModal event={event} />);
        }
      }}
      {...buttonProps}
    >
      {children}
    </Button>
  );
}
