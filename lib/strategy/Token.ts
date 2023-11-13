import { Emitter } from "@servie/events";

import { Pool } from "./Pool";

interface TokenEvents {
  Minted: [{ to: string; amount: number }];
  Transferred: [{ from: string; to: string; amount: number }];
  Burnt: [{ from: string; amount: number }];
  MarketPriceUpdated: [{ price: number }];
}

export enum TokenFeature {
  ERC20,
  LiquidityToken,
}

export class Token extends Emitter<TokenEvents> {
  balances: Record<string, number> = {};
  totalSupply = 0;
  feature: TokenFeature = TokenFeature.ERC20;

  public readonly symbol: string;
  public readonly name: string;

  public pool: Pool | undefined;

  public marketPrice: number = 0;
  private lastFetch: number = 0;

  private fetchPromise: null | Promise<number>;

  constructor(symbol: string, name: string, feature = TokenFeature.ERC20) {
    super();
    this.symbol = symbol;
    this.name = name;
    this.feature = feature;
    this.fetchPromise = null;
  }

  setMarketPrice(price: number) {
    this.marketPrice = price;
    this.emit("MarketPriceUpdated", { price });
  }

  async fetchMarketPrice(): Promise<number> {
    return this.marketPrice;
  }

  mint(amount: number, to: string) {
    this.totalSupply += amount;
    if (!this.balances[to]) {
      this.balances[to] = amount;
    } else {
      this.balances[to] += amount;
    }
    this.emit("Minted", { to, amount });
  }

  transfer(from: string, to: string, amount: number) {
    if (!this.balances[to]) {
      this.balances[to] = 0;
    }
    if (this.balanceOf(from) < amount) {
      throw new Error(
        `no sufficient funds (${amount} > ${this.balanceOf(from)})`,
      );
    }
    this.balances[from] -= amount;
    this.balances[to] += amount;
    this.emit("Transferred", { from, to, amount });
  }

  burn(from: string, amount: number) {
    this.balances[from] -= amount;
    this.totalSupply -= amount;
    this.emit("Burnt", { from, amount });
  }

  balanceOf(from: string) {
    return this.balances[from] || 0;
  }

  shareOf(from: string) {
    return this.balanceOf(from) / this.totalSupply;
  }
}
