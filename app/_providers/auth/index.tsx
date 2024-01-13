"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { modal } from "@/app/_providers/modal";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { useNDK } from "../ndk";
import { useKeyboardShortcut } from "@/lib/hooks/useKeyboardShortcut";
import LoginModal from "@/components/modals/login";

export default function Auth() {
  const router = useRouter();
  const { currentUser, logout, attemptLogin } = useCurrentUser();
  const { ndk } = useNDK();

  useEffect(() => {
    console.log("at useEffect for attemptLogin", currentUser);
    if (ndk && !currentUser) {
      void attemptLogin();
    }
  }, [ndk]);
  useKeyboardShortcut(["shift", "ctrl", "u"], () => {
    if (currentUser) {
      router.push(`/channel/${currentUser?.npub}`);
    } else {
      modal.show(<LoginModal />, {
        id: "login",
      });
    }
  });
  useKeyboardShortcut(["shift", "ctrl", "q"], () => {
    if (currentUser) {
      logout();
    }
  });

  useEffect(() => {
    if (ndk && !currentUser) {
      void attemptLogin();
    }
  }, [ndk]);

  return <></>;
}
