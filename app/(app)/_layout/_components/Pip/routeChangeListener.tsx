"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

type RouteChangeListener = {
  callback: (pathname: string) => void;
};

export function RouteChangeListener({ callback }: RouteChangeListener) {
  const pathname = usePathname();
  useEffect(() => {
    callback(pathname);
  }, [pathname]);

  return <></>;
}
