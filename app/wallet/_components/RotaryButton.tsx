"use client";
import { useState } from "react";
import useLongPress from "../_hooks/useLongPress";
import { modal } from "@/app/_providers/modal";
import SendModal from "./SendModal";
import ScanModal from "@/components/modals/scan";
import QRCodeModal from "@/components/modals/qr";
import { UserMint } from "@prisma/client";
import { useWallet } from "../_providers/walletProvider";
import { Proof } from "@cashu/cashu-ts";
type RotaryButtonProps = {
  onScan: (data: string) => Promise<boolean>;
  mint: UserMint;
  loading: boolean;
};

export default function RotaryButton({
  onScan,
  loading,
  mint,
}: RotaryButtonProps) {
  const { sendToken } = useWallet();

  async function handleSendEcash(
    amount: number,
    memo: string,
    proofs: Proof[],
  ) {
    const token = await sendToken(mint.mintUrl, amount, memo, proofs);
    console.log("returing", token);
    return token;
  }

  const [rotation, setRotation] = useState(-150);
  function getSafariVal(num: number) {
    if (num <= 180) return num;
    return -180 + (num - 180);
  }
  function handleRotate() {
    setRotation((prev) => {
      const val = getSafariVal(prev);
      if (val === -150) {
        return -90;
      } else if (val === -90) {
        return -30;
      } else {
        return -150;
      }
    });
  }
  function handleSelect() {
    let step = "send";
    const remainder = rotation % 180;
    if (remainder === -90) {
      step = "scan";
      modal.show(
        <ScanModal
          onCapture={(e) => {
            onScan(e).then((e) => {
              if (e) {
                modal.dismiss();
              }
            });
          }}
          onDismiss={() => modal.dismiss()}
          loading={loading}
        />,
        {
          className: "bg-gradient-to-bl from-gray-600 to-gray-700",
        },
      );
    } else if (remainder === -30) {
      step = "show";
      modal.show(
        <QRCodeModal
          code="lnurl1dp68gurn8ghj7urjd9kkzmpwdejhgtewwajkcmpdddhx7amw9akxuatjd3cz7cmgv9exxmmpd3j8yct8dahxvmrexy0xna2x"
          title="Receive Bitcoin"
          displayValue="lnurl1dp68gurn8ghj7urjd9kkzmpwdejhgtewwajkcmpdddhx7amw9akxuatjd3cz7cmgv9exxmmpd3j8yct8dahxvmrexy0xna2x"
          description="Scan Qr code to receive lightning"
        />,
        {
          className: "bg-gradient-to-bl from-gray-600 to-gray-700",
        },
      );
    } else {
      modal.show(<SendModal mint={mint} sendEcash={handleSendEcash} />, {
        className: "bg-gradient-to-bl from-gray-600 to-gray-700",
      });
    }
  }

  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500,
  };
  const longPressEvent = useLongPress(
    handleSelect,
    handleRotate,
    defaultOptions,
  );
  return (
    <div className="m-auto flex h-40 w-40 scale-150 transform select-none text-center">
      <div className="center absolute inset-x-0 -top-12">
        <p className="font-semibold uppercase text-gray-600">Action Switch</p>
      </div>
      <div
        style={{
          rotate: `-60deg`,
        }}
        className="absolute h-40 w-40 origin-center scale-110 transform text-sm font-semibold uppercase text-gray-600"
      >
        Send
      </div>

      <div className="absolute h-40 w-40 origin-center scale-110 transform text-sm font-semibold uppercase text-gray-600">
        Scan
      </div>

      <div
        style={{
          rotate: `60deg`,
        }}
        className="absolute h-40 w-40 origin-center scale-110 transform text-sm font-semibold uppercase text-gray-600"
      >
        Show
      </div>
      {/* @ts-ignore */}
      <div
        {...longPressEvent}
        className="bg-texture-otis-redding relative m-auto h-24 w-24 rounded-full bg-primary bg-opacity-80"
      >
        <div className="absolute h-24 w-24 scale-125 transform rounded-full border-2 border-gray-600"></div>
        <div className="absolute h-24 w-24 rounded-full border-l-2 border-r-2 border-t-2 border-white border-opacity-50"></div>
        <div className="absolute h-24 w-24 rounded-full border-b-2 border-l-2 border-r-2 border-black border-opacity-25"></div>
        <div
          style={{
            rotate: `${rotation}deg`,
          }}
          className="bg-texture-otis-redding absolute m-auto mb-[-4px] ml-12 mt-12 h-1 w-1/2 origin-top-left -translate-x-1 transform transition-all duration-200"
        >
          <div className="ml-auto h-1 w-4/5 -translate-y-[3px] transform rounded-md bg-gray-200 bg-opacity-90"></div>
        </div>

        <div className="absolute h-24 w-24 rounded-full shadow-2xl"></div>
        <div className="absolute h-24 w-24 rounded-full shadow-2xl"></div>
        <div className="absolute h-24 w-24 rounded-full shadow-xl"></div>
        <div className="absolute h-24 w-24 rounded-full shadow-xl"></div>
        <div className="absolute h-24 w-24 rounded-full shadow-lg"></div>
        <div className="absolute h-24 w-24 rounded-full shadow-md"></div>
      </div>
      <div className="center absolute inset-x-0 -bottom-5">
        <p className="text-[12px] font-semibold uppercase text-gray-600">
          [Hold to select]
        </p>
      </div>
    </div>
  );
}
