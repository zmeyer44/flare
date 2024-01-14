"use client";

import { useState } from "react";

import useAuthGuard from "./hooks/useAuthGuard";
import { modal } from "@/app/_providers/modal";
import { useNDK } from "@/app/_providers/ndk";
import { zapEvent, zapUser } from "@/lib/actions/zap";
import { type NostrEvent } from "@nostr-dev-kit/ndk";
import { toast } from "sonner";

import { HiOutlineLightningBolt } from "react-icons/hi";
import { RiSubtractFill, RiAddFill } from "react-icons/ri";
import { formatCount } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SendPaymentResponse } from "webln";

const intervals = [
  10, 25, 50, 75, 100, 150, 200, 250, 350, 500, 750, 1000, 1250, 1500, 2_000,
  2_500, 3_000, 3_500, 4_000, 5_000, 6_000, 7_500, 10_000, 12_500, 15_000,
  20_000, 25_000, 30_000, 40_000, 50_000, 75_000, 100_000, 150_000, 200_000,
  300_000, 500_000, 750_000, 1_000_000, 1_250_000, 1_500_000, 2_000_000,
];

type ZapEvent = {
  type: "event";
  event: NostrEvent;
};
type ZapUser = {
  type: "user";
  pubkey: string;
};
type ZapModalProps = {
  title?: string;
} & (ZapEvent | ZapUser);

export default function ZapModal({
  title = "Send Zap",

  ...props
}: ZapModalProps) {
  useAuthGuard();
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState("");
  const [sats, setSats] = useState(2000);
  const { ndk } = useNDK();

  function onClick(type: "+" | "-") {
    setSats((prev) => {
      let index = intervals.findIndex((i) => prev === i);
      if (type === "+") {
        index++;
      } else {
        index--;
      }

      return intervals.at(index) ?? 2000;
    });
  }

  async function handleSendZap() {
    try {
      setIsLoading(true);
      let result: SendPaymentResponse | undefined;
      if (props.type === "event") {
        result = await zapEvent(ndk!, sats, props.event, note);
      } else {
        result = await zapUser(ndk!, sats, props.pubkey, note);
      }
      toast.success("Zap Sent!");
      modal.dismiss();
    } catch (err) {
      toast.error("An error occured");
      console.log("error sending zap", err);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="px-4 md:px-0">
      <div className="flex pb-5">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>
      <div className="flex flex-col gap-y-5">
        <div className="pb-2">
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full"
              onClick={() => onClick("-")}
              disabled={sats <= 10}
            >
              <RiSubtractFill className="h-4 w-4" />
              <span className="sr-only">Decrease</span>
            </Button>
            <div className="flex-1 text-center">
              <div className="text-5xl font-bold tracking-tighter">
                {formatCount(sats)}
              </div>
              <div className="text-[0.70rem] uppercase text-muted-foreground">
                Satoshis
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full"
              onClick={() => onClick("+")}
              disabled={sats >= 2_000_000}
            >
              <RiAddFill className="h-4 w-4" />
              <span className="sr-only">Increase</span>
            </Button>
          </div>
          <div className="pt-3">
            <Label>Note</Label>
            <Textarea
              placeholder="Add a note..."
              onChange={(e) => setNote(e.target.value)}
              value={note}
              className="auto-sizing"
            />
          </div>
        </div>

        <Button
          onClick={handleSendZap}
          loading={isLoading}
          className="w-full gap-x-1"
        >
          <span>Send Zap</span>
          <HiOutlineLightningBolt className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
