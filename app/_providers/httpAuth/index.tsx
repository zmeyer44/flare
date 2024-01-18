"use client";
import { useEffect, useState } from "react";
import currentUserStore from "@/lib/stores/currentUser";
import { useNDK } from "../ndk";
import type NDK from "@nostr-dev-kit/ndk";
import { useSession, signIn } from "next-auth/react";
import { authEvent } from "@/lib/actions/create";

export function HttpAuthProvider() {
  const { currentUser } = currentUserStore();
  const { ndk } = useNDK();
  const { data: session, status: httpAuthStatus } = useSession();
  const [promptShown, setPromptShown] = useState(false);

  useEffect(() => {
    if (!currentUser || session || promptShown) return;
    if (ndk?.activeUser?.pubkey && httpAuthStatus === "unauthenticated") {
      console.log("Active user", ndk?.activeUser?.pubkey);
      void attemptHttpLogin_();
      setPromptShown(true);
    }
  }, [currentUser, ndk, httpAuthStatus, session]);

  async function attemptHttpLogin_() {
    if (!ndk || !currentUser || !ndk?.activeUser?.pubkey) return;
    return await attemptHttpLogin(ndk);
  }
  return null;
}

export async function attemptHttpLogin(ndk: NDK) {
  if (!ndk) return;
  try {
    const event = await authEvent(ndk);
    if (!event) return;
    const authRes = await signIn("nip-98", {
      event: JSON.stringify(event),
      redirect: false,
    });
    console.log("authRes", authRes);
    return authRes;
  } catch (err) {
    console.log("Error http login");
  }
}
