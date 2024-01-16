"use client";
import { useState } from "react";
import { modal } from "@/app/_providers/modal";
import SelectModal from "@/components/modals/select";
import SendEcashModal from "./SendEcashModal";
import QRCodeModal from "@/components/modals/qr";
import { useWallet } from "../_providers/walletProvider";
import { toast } from "sonner";
import { UserMint } from "@prisma/client";
import { api } from "@/lib/trpc/api";
import { Proof, Token } from "@cashu/cashu-ts";

type SendModalProps = {
  sendEcash: (
    amount: number,
    memo: string,
    proofs: Proof[],
  ) => Promise<string | null>;
  mint: UserMint;
};
export default function SendModal({ mint, sendEcash }: SendModalProps) {
  const [sendEcashLoading, setSendEcashLoading] = useState(false);

  async function onSubmitEcash(amount: number, memo?: string) {
    if (!mint?.mintUrl) {
      console.log("Returning", mint);
      return;
    }
    setSendEcashLoading(true);
    try {
      const encodedToken = await sendEcash(amount, memo ?? "", []);
      if (encodedToken) {
        toast.success("Token Created!");
        modal.show(
          <QRCodeModal
            code={encodedToken}
            displayValue={encodedToken}
            description="Copy token and paste into compatable Cashu wallet."
            title="New Cashu token 🥜"
          />,
        );
        modal.dismiss("send-ecash");
      } else {
        toast.error("An error has occured");
      }
    } catch (err) {
      console.log("Error", err);
    } finally {
      setSendEcashLoading(false);
    }
  }

  function handleSelect(e: { key: string; label: string }) {
    modal.dismiss("select");
    console.log("at handleSelect");
    if (e.key === "lightning") {
    } else {
      modal.show(
        <SendEcashModal
          isLoading={sendEcashLoading}
          onSubmit={(sats, memo) => {
            // modal.dismiss("send-ecash");
            onSubmitEcash(sats, memo);
          }}
        />,
        {
          id: "send-ecash",
          className: "bg-gradient-to-bl from-gray-600 to-gray-700",
        },
      );
    }
  }
  return (
    <SelectModal
      title="Send"
      description="Select how you would like to send sats."
      onSelect={handleSelect}
      options={[
        {
          key: "ecash",
          label: "Send Ecash",
        },
        {
          key: "lightning",
          label: "Pay Lightning Invoice",
        },
      ]}
      getKeyAndLabel={(e) => ({
        key: e.key,
        label: e.label,
      })}
    />
  );
}
