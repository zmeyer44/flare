"use client";
import { useState, useEffect } from "react";
import {
  POOL_FEE,
  SATS_PER_SHARE,
  INITIAL_LIQUIDITY_SHARES,
  DEFAULT_SHARE_PURCHASE,
} from "@/constants";
import { Pool } from "@/lib/strategy/Pool";
import { Token } from "@/lib/strategy/Token";

export function useMarket() {
  const [pool, setPool] = useState<Pool>();
  const [tokens, setTokens] = useState<[Token, Token]>();
  const [split, setSplit] = useState<[number, number]>([0.5, 0.5]);
  useEffect(() => {
    const tokenA = new Token("YES", "Yes outcome");
    tokenA.setMarketPrice(0.5);
    const tokenB = new Token("NO", "No outcome");
    tokenB.setMarketPrice(0.5);
    setTokens([tokenA, tokenB]);
    tokenA.mint(INITIAL_LIQUIDITY_SHARES, "admin");
    tokenB.mint(INITIAL_LIQUIDITY_SHARES, "admin");
    const initialPool = new Pool("liquidityPool", tokenA, tokenB, POOL_FEE);
    initialPool.addLiquidity(
      "admin",
      INITIAL_LIQUIDITY_SHARES,
      INITIAL_LIQUIDITY_SHARES,
    );
    setPool(initialPool);
    console.log(initialPool.poolInfo());
  }, []);
  useEffect(() => {
    if (!pool || !tokens) return;
    setSplit([
      pool.price(tokens[0]) /
        pool
          .prices()
          .reduce((prev, currentValue, index) => prev + currentValue, 0),
      pool.price(tokens[1]) /
        pool
          .prices()
          .reduce((prev, currentValue, index) => prev + currentValue, 0),
    ]);
  }, [pool, tokens]);
  function buyShares(token: Token, amount: number) {
    if (!tokens || !pool) return;
    for (const t of tokens) {
      t.mint(amount, "user");
      console.log("Token, supply, ", t.totalSupply);
    }
    pool.buy(
      "user",
      token,
      tokens.find((t) => t.symbol !== token.symbol)!,
      amount,
    );
    setSplit([
      1 -
        pool.price(tokens[0]) /
          pool
            .prices()
            .reduce((prev, currentValue, index) => prev + currentValue, 0),
      1 -
        pool.price(tokens[1]) /
          pool
            .prices()
            .reduce((prev, currentValue, index) => prev + currentValue, 0),
    ]);
  }
  return {
    pool,
    tokens,
    split,
    buyShares,
  };
}
