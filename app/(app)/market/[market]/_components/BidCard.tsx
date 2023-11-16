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
import { formatCount } from "@/lib/utils";
import { useModal } from "@/app/_providers/modal/provider";
import PurchaseModal from "@/components/modals/purchase";

const intervals = [
  10, 25, 50, 75, 100, 150, 200, 250, 350, 500, 750, 1000, 1250, 1500, 2_000,
  2_500, 3_000, 3_500, 4_000, 5_000, 6_000, 7_500, 10_000, 12_500, 15_000,
  20_000, 25_000, 30_000, 40_000, 50_000, 75_000, 100_000, 150_000, 200_000,
  300_000, 500_000, 750_000, 1_000_000, 1_250_000, 1_500_000, 2_000_000,
];
export function BidCard() {
  const modal = useModal();
  const [sats, setSats] = useState(2000);
  const { pool, tokens, split, buyShares, quotePrice } = useMarket();

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
  if (!tokens || !pool) {
    return null;
  }
  return (
    <Card className="sticky top-[calc(var(--header-height)_+_12px)] w-full">
      <CardHeader className="border-b p-5 pb-4">
        <CardTitle>Place a bet</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
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

        <div className="w-full pt-5">
          <div className="flex items-center gap-2 transition-all group-hover:translate-y-[-20px]">
            <Button
              onClick={() =>
                modal?.show(
                  <PurchaseModal
                    buyShares={buyShares}
                    quotePrice={quotePrice}
                    split={split}
                    tokens={tokens}
                    token={tokens[0]}
                    pool={pool}
                  />,
                )
              }
              className="flex-1 rounded-sm font-semibold"
            >
              Buy Yes
            </Button>
            <Button
              onClick={() =>
                modal?.show(
                  <PurchaseModal
                    buyShares={buyShares}
                    split={split}
                    tokens={tokens}
                    token={tokens[1]}
                    pool={pool}
                    quotePrice={quotePrice}
                  />,
                )
              }
              className="flex-1 rounded-sm font-semibold"
              variant={"secondary"}
            >
              Buy No
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
