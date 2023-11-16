"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Split from "@/components/spread/Split";
import { Button } from "@/components/ui/button";

import {
  POOL_FEE,
  SATS_PER_SHARE,
  INITIAL_LIQUIDITY_SHARES,
  DEFAULT_SHARE_PURCHASE,
} from "@/constants";
import { useMarket } from "@/lib/hooks/useMarket";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { RiSubtractFill, RiAddFill } from "react-icons/ri";
import { cn, formatCount, formatNumber } from "@/lib/utils";
import { Token } from "@/lib/strategy/Token";
import { useNDK } from "@/app/_providers/ndk";
import { Pool } from "@/lib/strategy/Pool";
import { toast } from "sonner";
import { sendZap } from "@/lib/actions/zap";

const intervals = [
  10, 25, 50, 75, 100, 150, 200, 250, 350, 500, 750, 1000, 1250, 1500, 2_000,
  2_500, 3_000, 3_500, 4_000, 5_000, 6_000, 7_500, 10_000, 12_500, 15_000,
  20_000, 25_000, 30_000, 40_000, 50_000, 75_000, 100_000, 150_000, 200_000,
  300_000, 500_000, 750_000, 1_000_000, 1_250_000, 1_500_000, 2_000_000,
];

type PurchaseModalProps = {
  split: [number, number];
  buyShares: (token: Token, amount: number) => void;
  quotePrice: (token: Token, sats: number) => number | undefined;
  tokens: [Token, Token];
  token: Token;
  pool: Pool;
};
const testEvent = {
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
export default function PurchaseModal({
  split,
  buyShares,
  quotePrice,
  token,
  pool,
}: PurchaseModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [sats, setSats] = useState(2000);
  const { ndk } = useNDK();
  console.log("pool", pool);
  const stats = [
    {
      label: "Avg price",
      value: `${Math.round(sats / (quotePrice(token, sats) ?? 0))} sats`,
      className: "text-primary",
    },
    {
      label: "Total shares",
      value: `${Math.round(quotePrice(token, sats) ?? 0)} shares`,
    },
    {
      label: "Potential payout",
      value: `+${formatNumber(
        Math.round(quotePrice(token, sats) ?? 0) * SATS_PER_SHARE,
      )} sats`,
      className: "text-green-600",
    },
  ];
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
      const result = await sendZap(ndk!, sats, testEvent);
      buyShares(token, sats / SATS_PER_SHARE);
      toast.success("Shares bought!");
    } catch (err) {
      console.log("error sending zap", err);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="p-5">
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
          <div className="mt-2 text-4xl font-bold tracking-tighter">
            {formatCount(sats)}
          </div>
          <div className="text-[0.70rem] uppercase text-muted-foreground">
            Sats
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
      <div className="mt-4 flex flex-col gap-y-0.5">
        <span className="text-center text-[10px] leading-3 text-muted-foreground">
          Sat Spread
        </span>
        <Split shares={split} />
      </div>

      {/* Stats */}
      <div className="mt-4">
        {stats.map((s) => (
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              {s.label}
            </p>
            <p className={cn("text-sm font-medium", s.className)}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="w-full bg-background pt-5">
        <div className="flex items-center gap-2 transition-all group-hover:translate-y-[-20px]">
          <Button
            loading={isLoading}
            onClick={() => handleSendZap()}
            className="flex-1 rounded-sm font-semibold"
          >
            Confirm Purchase
          </Button>
        </div>
      </div>
    </div>
  );
}
