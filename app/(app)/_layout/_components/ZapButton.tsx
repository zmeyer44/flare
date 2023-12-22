"use client";
import ZapModal from "@/components/modals/zap";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { modal } from "@/app/_providers/modal";
const flockstrEvent = {
  created_at: 1697736945,
  content:
    "Officially announcing Flockstr. Check it out at https://flockstr.com",
  tags: [
    ["r", "https://flockstr.com"],
    ["client", "flockstr"],
  ],
  kind: 1,
  pubkey: "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
  id: "a867ff28711eeab4767fb6bacbb33dfe17b2b5bbbff98f8e57f90a85ea684b0a",
  sig: "37d8918e6da88d989467021a1f5809a3fbcab941ca1044d109ce261f29270d2d545aaa84297b7f224ae1ad7760263e50c317c24abc809034bcdb5c3260faf4b0",
};

export default function ZapButton() {
  return (
    <div className="center relative w-full">
      <button
        onClick={() => {
          modal.show(
            <ZapModal title="Give Flare a Tip!" event={flockstrEvent} />,
          );
        }}
        className={cn(
          "center group relative min-h-[48px] min-w-[48px] rounded-lg  hover:bg-muted",
          "text-muted-foreground hover:text-foreground",
        )}
      >
        <HiOutlineLightningBolt
          className={cn("h-6 w-6 shrink-0")}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
