"use client";
import { useEffect, useState } from "react";
import currentUserStore from "@/lib/stores/currentUser";
import { useNDK } from "../ndk";
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
      void attemptHttpLogin();
      setPromptShown(true);
    }
  }, [currentUser, ndk, httpAuthStatus, session]);

  async function attemptHttpLogin() {
    if (!ndk || !currentUser || !ndk?.activeUser?.pubkey) return;
    try {
      const event = await authEvent(ndk);
      if (!event) return;
      const authRes = await signIn("nip-98", {
        event: JSON.stringify(event),
        redirect: false,
      });
      console.log("authRes", authRes);
    } catch (err) {
      console.log("Error http login");
    }
  }
  return null;
}
