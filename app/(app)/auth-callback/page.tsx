"use client";
import { useEffect } from "react";
import Spinner from "@/components/spinner";
import { useSearchParams } from "next/navigation";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { useNDK } from "@/app/_providers/ndk";
import { getPublicKey } from "nostr-tools";

export default function Page() {
  const { loginWithNip46, ndk } = useNDK();
  const { loginWithPubkey } = useCurrentUser();
  const searchParams = useSearchParams();
  useEffect(() => {
    const pubkey = searchParams.get("pubkey");
    if (pubkey && ndk) {
      alert(`pubkey ${pubkey}`);
      void attemptLogin(pubkey);
    }
  }, [searchParams, ndk]);

  async function attemptLogin(pubkey: string) {
    const attempt = localStorage.getItem("nip46-attempt-sk");
    if (attempt) {
      alert(`attempt ${attempt}`);
      const login = await loginWithNip46(pubkey, attempt);
      if (login) {
        alert("LOgin");
        await loginWithPubkey(pubkey);
        return;
      }
    }
  }

  return (
    <div className="center py-10 text-primary">
      <Spinner />
    </div>
  );
}
