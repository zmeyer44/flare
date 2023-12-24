"use client";
import { ComponentProps } from "react";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import LoginModal from "@/components/modals/login";
import ZapModal from "@/components/modals/zap";
import { modal } from "@/app/_providers/modal";
import type { NostrEvent } from "@nostr-dev-kit/ndk";
import { Button } from "@/components/ui/button";

type ZapEvent = {
  zapType: "event";
  event: NostrEvent;
};
type ZapUser = {
  zapType: "user";
  pubkey: string;
};

type ZapButtonProps = ComponentProps<typeof Button> & (ZapEvent | ZapUser);

export default function ZapButton({
  children = "Zap",
  ...buttonProps
}: ZapButtonProps) {
  const { currentUser } = useCurrentUser();

  return (
    <Button
      onClick={() => {
        if (buttonProps.zapType === "event") {
          modal.show(<ZapModal event={buttonProps.event} type="event" />);
        } else {
          modal.show(<ZapModal pubkey={buttonProps.pubkey} type="user" />);
        }
      }}
      {...buttonProps}
    >
      {children}
    </Button>
  );
}
