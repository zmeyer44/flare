"use client";

import { Toaster } from "sonner"; // import useRouteChange from "@/lib/hooks/useRouteChange";
import { NDKProvider } from "./ndk";
import { RELAYS } from "@/constants";
import TRPCProvider from "./trpc/Provider";
import { SessionProvider } from "next-auth/react";
import { HttpAuthProvider } from "./httpAuth";
import { GoogleAnalyticsInit } from "@/lib/analytics";
import { Modstr } from "./modal";
import { PlayerProvider } from "./pipPlayer";
import Auth from "./auth";

export function Providers({ children }: { children: React.ReactNode }) {
  // useRouteChange(handleRouteChange);
  return (
    <>
      <SessionProvider>
        <TRPCProvider>
          <NDKProvider relayUrls={RELAYS}>
            {/* <Toaster richColors className="dark:hidden" /> */}
            <Toaster theme="dark" className="z-toast hidden md:block" />
            <Toaster
              theme="dark"
              richColors
              position="top-center"
              className="z-toast md:hidden"
            />
            <Modstr />
            <HttpAuthProvider />
            <PlayerProvider>
              <div vaul-drawer-wrapper="" className="min-h-[100svh]">
                {children}
              </div>
              <Auth />
            </PlayerProvider>
          </NDKProvider>
        </TRPCProvider>
      </SessionProvider>
      <GoogleAnalyticsInit />
    </>
  );
}
