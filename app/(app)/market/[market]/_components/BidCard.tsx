"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Split from "@/components/spread/Split";
import { Button } from "@/components/ui/button";
import { formatCount } from "@/lib/utils";
import {
  POOL_FEE,
  SATS_PER_SHARE,
  INITIAL_LIQUIDITY_SHARES,
  DEFAULT_SHARE_PURCHASE,
} from "@/constants";
import { useMarket } from "@/lib/hooks/useMarket";

export function BidCard() {
  const { pool, tokens, split, buyShares } = useMarket();
  if (!tokens || !pool) {
    return null;
  }
  return (
    <Card className="sticky top-[calc(var(--header-height)_+_12px)] w-full">
      <CardHeader className="border-b p-5">
        <CardTitle>Place a bet</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="flex flex-col gap-y-0.5">
          <span className="text-center text-[10px] leading-3 text-muted-foreground">
            Sat Spread
          </span>

          <Split shares={split} />
        </div>
        <div className="w-full bg-background pt-5">
          <div className="flex items-center gap-2 transition-all group-hover:translate-y-[-20px]">
            <Button
              onClick={() => buyShares(tokens[0], DEFAULT_SHARE_PURCHASE)}
              className="flex-1 rounded-sm font-semibold"
            >
              Buy Yes
            </Button>
            <Button
              onClick={() => buyShares(tokens[1], DEFAULT_SHARE_PURCHASE)}
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
