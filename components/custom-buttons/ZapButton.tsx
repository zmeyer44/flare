"use client";
import { ComponentProps } from "react";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import LoginModal from "@/components/modals/login";
import ZapModal from "@/components/modals/zap";
import { modal } from "@/app/_providers/modal";
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

  return (
    <Button
      onClick={() => {
        modal.show(<ZapModal event={event} />);
      }}
      {...buttonProps}
    >
      {children}
    </Button>
  );
}
