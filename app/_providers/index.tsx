"use client";

import { Toaster } from "sonner";
import { ModalProvider } from "./modal/provider";
import useRouteChange from "@/lib/hooks/useRouteChange";

export function Providers({ children }: { children: React.ReactNode }) {
  const handleRouteChange = (url: string) => {
    const RichHistory = sessionStorage.getItem("RichHistory");
    if (!RichHistory) {
      sessionStorage.setItem("RichHistory", "true");
    }
  };
  useRouteChange(handleRouteChange);
  return (
    <>
      <Toaster richColors className="dark:hidden" />
      <Toaster theme="dark" className="hidden dark:block" />
      <ModalProvider>{children}</ModalProvider>
    </>
  );
}
