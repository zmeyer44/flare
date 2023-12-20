"use client";

import { useState } from "react";

import useAuthGuard from "./hooks/useAuthGuard";
import { useModal } from "@/app/_providers/modal/provider";
import { useNDK } from "@/app/_providers/ndk";
import { sendZap } from "@/lib/actions/zap";
import { type NostrEvent } from "@nostr-dev-kit/ndk";
import { toast } from "sonner";

import { HiOutlineLightningBolt, HiCheck } from "react-icons/hi";
import { RiSubtractFill, RiAddFill } from "react-icons/ri";
import { formatCount, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ModalProps = {};
export default function ZapModal({}: ModalProps) {
  useAuthGuard();
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState("");
  const modal = useModal();
  const [sats, setSats] = useState(2000);
  const { ndk } = useNDK();

  const tier = {
    name: "Basic",
    id: "tier-enterprise",
    href: "#",
    size: "2 GB",
    price: 10000,
    description: "Dedicated storage space for video uploads on Flare.",
    features: [
      "2 Gigabytes of storage",
      "Never expires",
      "Storage on AWS S3",
      "Dedicated support",
    ],
    featured: false,
  };

  async function handleSendZap() {
    try {
      setIsLoading(true);
      // const result = await sendZap(ndk!, sats, event, note);
      toast.success("Zap Sent!");
    } catch (err) {
      console.log("error sending zap", err);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="pb-1">
      <div className="flex pb-5">
        <h1 className="text-lg font-semibold text-foreground">
          Purchase storage credits
        </h1>
      </div>
      <div className="flex flex-col gap-y-5">
        <div className={cn("rounded-3xl p-8 ring-1 ring-primary sm:p-10")}>
          <h3
            className={cn("text-primary", "text-base font-semibold leading-7")}
          >
            {tier.name}
          </h3>
          <p className="mt-4 flex items-baseline gap-x-2">
            <span
              className={cn(
                "text-5xl font-bold tracking-tight text-foreground",
              )}
            >
              {tier.size}
            </span>
            <span className={cn("text-base text-muted-foreground/80")}>
              {`${formatNumber(tier.price)} sats`}
            </span>
          </p>
          <p className={cn("mt-6 text-base leading-7 text-foreground/80")}>
            {tier.description}
          </p>
          <ul
            role="list"
            className={cn(
              "mt-8 space-y-3 text-sm leading-6 text-foreground/80 sm:mt-10",
            )}
          >
            {tier.features.map((feature) => (
              <li key={feature} className="flex gap-x-3">
                <HiCheck
                  className={cn("text-primary", "h-6 w-5 flex-none")}
                  aria-hidden="true"
                />
                {feature}
              </li>
            ))}
          </ul>
          <Button
            onClick={handleSendZap}
            loading={isLoading}
            className="mt-8 w-full gap-x-1 sm:mt-10"
          >
            <span>Get started</span>
            <HiOutlineLightningBolt className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
