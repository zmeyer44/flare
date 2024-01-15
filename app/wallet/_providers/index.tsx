"use client";

import { WalletProvider } from "./walletProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider
      mintUrls={
        process.env.NEXT_PUBLIC_TRUSTED_MINT_URLS?.split(",") as string[]
      }
    >
      <div className="min-h-[100svh]">{children}</div>
    </WalletProvider>
  );
}
