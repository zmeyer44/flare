"use client";
import { useEffect } from "react";
import Spinner from "@/components/spinner";
import { useSearchParams } from "next/navigation";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { useNDK } from "@/app/_providers/ndk";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { loginWithNip46, ndk } = useNDK();
  const { loginWithPubkey, currentUser } = useCurrentUser();
  const searchParams = useSearchParams();
  useEffect(() => {
    if (currentUser) {
      router.push("/");
      return;
    }
    const pubkey = searchParams.get("pubkey");
    if (pubkey && ndk) {
      void attemptLogin(pubkey);
    }
  }, [searchParams, ndk, currentUser]);

  async function attemptLogin(pubkey: string) {
    const attempt = localStorage.getItem("nip46-attempt-sk");
    if (attempt) {
      localStorage.removeItem("nip46-attempt-sk");
      const login = await loginWithNip46(pubkey, attempt);
      if (login) {
        if (login.sk) {
          localStorage.setItem("nip46sk", login.sk);
          localStorage.setItem("nip46target", pubkey);
        }
        // alert(`Logging in  ${login.remoteSigner.remotePubkey} vs ${pubkey}`);
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
