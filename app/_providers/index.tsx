"use client";

import { Toaster } from "sonner";
import { ModalProvider } from "./modal-old/provider";
// import useRouteChange from "@/lib/hooks/useRouteChange";
import { NDKProvider } from "./ndk";
import { RELAYS } from "@/constants";
import TRPCProvider from "./trpc/Provider";
import { SessionProvider } from "next-auth/react";
import { HttpAuthProvider } from "./httpAuth";
import { GoogleAnalyticsInit } from "@/lib/analytics";
import { Modstr } from "./modal";

export function Providers({ children }: { children: React.ReactNode }) {
  const handleRouteChange = (url: string) => {
    const RichHistory = sessionStorage.getItem("RichHistory");
    if (!RichHistory) {
      sessionStorage.setItem("RichHistory", "true");
    }
  };
  // useRouteChange(handleRouteChange);
  return (
    <>
      <SessionProvider>
        <TRPCProvider>
          <NDKProvider relayUrls={RELAYS}>
            {/* <Toaster richColors className="dark:hidden" /> */}
            <Toaster theme="dark" className="hidden dark:block" />
            <Modstr />
            <HttpAuthProvider />
            {/* <ModalProvider>{children}</ModalProvider> */}
            {children}
          </NDKProvider>
        </TRPCProvider>
      </SessionProvider>
      <GoogleAnalyticsInit />
    </>
  );
}
