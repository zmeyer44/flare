"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useConfig } from "@/lib/hooks/useConfig";
import { copyText } from "@/lib/utils";
import { useModal } from "@/app/_providers/modal/provider";
import { useNDK } from "@/app/_providers/ndk";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { nip19 } from "nostr-tools";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type LoginModalProps = {};

export default function LoginModal({}: LoginModalProps) {
  const modal = useModal();
  const [config] = useConfig();
  const { loginWithNip07, loginWithSecret } = useNDK();
  const { loginWithPubkey, currentUser } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showExtensionLogin, setShowExtensionLogin] = useState(true);
  const [showPassphraseLogin, setShowPassphraseLogin] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [nsec, setNsec] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [email, setEmail] = useState("");
  const [encryptedNsec, setEncryptedNsec] = useState("");

  useEffect(() => {
    const shouldReconnect = localStorage.getItem("shouldReconnect");
    const encryptedNsec_ = localStorage.getItem("encrypted-nsec");

    const getConnected = async (shouldReconnect: string) => {
      let enabled: boolean | void = false;

      if (typeof window.nostr === "undefined") {
        return setShowExtensionLogin(false);
      }

      if (shouldReconnect === "true") {
        const user = await loginWithNip07();
        if (!user) {
          throw new Error("NO auth");
        }
        await loginWithPubkey(nip19.decode(user.npub).data.toString());
        // keys?.setKeys({
        //   privkey: "",
        //   pubkey: ,
        // });
      }

      if (typeof window.webln === "undefined") {
        return;
      }

      if (shouldReconnect === "true" && !window.webln.executing) {
        try {
          enabled = await window.webln.enable();
        } catch (e: any) {
          console.log(e.message);
        }
      }
      return enabled;
    };
    if (encryptedNsec_) {
      setEncryptedNsec(encryptedNsec_);
      setShowPassphraseLogin(true);
    } else if (shouldReconnect === "true") {
      getConnected(shouldReconnect);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      modal?.hide();
    }
  }, [currentUser]);

  async function handleLogin() {
    setIsLoading(true);
    if (typeof window.nostr !== "undefined") {
      const user = await loginWithNip07();
      if (!user) {
        throw new Error("NO auth");
      }
      await loginWithPubkey(nip19.decode(user.npub).data.toString());
      localStorage.setItem("shouldReconnect", "true");
    }

    if (typeof window.webln !== "undefined") {
      await window.webln.enable();
    }
    console.log("connected ");
    setIsLoading(false);
    modal?.hide();
  }

  async function handleLoginNsec(nsec_?: string) {
    setIsLoading(true);
    console.log("loging in");

    const user = await loginWithSecret(nsec_ ?? nsec);
    if (!user) {
      throw new Error("NO auth");
    }
    console.log("LOGIN", user);
    await loginWithPubkey(nip19.decode(user.npub).data.toString());
    if (typeof window.webln !== "undefined") {
      await window.webln.enable();
    }
    setIsLoading(false);
  }

  return (
    <div className="p-5">
      <div className="center text-center">
        <h1 className="font-main text-[30px] text-primary">Welcome to Flare</h1>
      </div>
      <div className="w-full space-y-4 bg-background pt-5">
        <div className="space-y-3">
          <Label>Nsec</Label>
          <Input
            value={nsec}
            onChange={(e) => setNsec(e.target.value)}
            placeholder="nsec..."
            className="text-[16px]"
          />
          <Button
            variant={"outline"}
            onClick={() => void handleLoginNsec()}
            loading={isLoading}
            className="w-full"
          >
            Connect with Nsec
          </Button>

          {/* <div className="center text-xs font-medium text-primary">
            Or, use
            {!!encryptedNsec && (
              <>
                <button
                  className="ml-1 hover:underline"
                  onClick={() => setShowPassphraseLogin(true)}
                >
                  Passphrase
                </button>
                <span className="mx-1">or</span>
              </>
            )}
            <button
              className="ml-1 hover:underline"
              onClick={() => setShowEmailLogin(true)}
            >
              Email
            </button>
          </div> */}
        </div>
        <div className="flex items-center gap-2 transition-all group-hover:translate-y-[-20px]">
          <Button
            className="flex-1 font-semibold"
            onClick={() => void handleLogin()}
            loading={isLoading}
          >
            Login with extension
          </Button>
        </div>
      </div>
    </div>
  );
}
