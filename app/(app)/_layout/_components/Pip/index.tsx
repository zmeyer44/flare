"use client";
import { RouteChangeListener } from "./routeChangeListener";
import MiniMobilePlayer from "./MobilePlayer";
import { usePlayer } from "@/app/_providers/pipPlayer";
import useCurrentUser from "@/lib/hooks/useCurrentUser";

const PIP_BLOCKED_PATHNAMES = [/^\/w\//];

export default function Pip() {
  const { dbUser } = useCurrentUser();
  const { player, wasPlaying, initPip, showPip } = usePlayer();
  function routeListener(pathname: string) {
    console.log("From routeListener", player.current?.currentTime);

    if (wasPlaying && PIP_BLOCKED_PATHNAMES.every((r) => !r.test(pathname))) {
      console.log("Running itit pip");
      initPip({ currentTime: Math.floor(player.current?.currentTime ?? 0) });
      return;
    }
    if (showPip && PIP_BLOCKED_PATHNAMES.some((r) => r.test(pathname))) {
      console.log("Running hide pip");
      initPip(undefined, false);
    }
  }
  if (dbUser?.role === "PRO") {
    return (
      <>
        <RouteChangeListener callback={routeListener} />
        <MiniMobilePlayer />
      </>
    );
  }
  return (
    <>
      <RouteChangeListener callback={routeListener} />
      <MiniMobilePlayer />
    </>
  );
}
