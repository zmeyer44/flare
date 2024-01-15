"use client";

import { useEffect, type ReactNode } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdContentCopy } from "react-icons/md";
import Image from "next/image";
import Template from "./template";
import { QrReader } from "react-qr-reader";
import QRFrameIcon from "@/assets/icons/QRFrameIcon";
import { Button } from "../ui/button";
import QrCode from "../qr/QrCode";
import { copyText, cn } from "@/lib/utils";
import { toast } from "sonner";

type QRCodeModalProps = {
  code: string;
  title?: string;
  description?: string;
  displayValue?: string;
};

export default function QRCodeModal({
  code,
  title = "Scan QR Code",
  description,
  displayValue,
}: QRCodeModalProps) {
  return (
    <Template title={title} description={description}>
      <div className="py-4 pb-10">
        <div className="center relative mx-auto aspect-square min-h-[340px] max-w-[300px]">
          <div className="flex flex-col gap-6">
            <QrCode code={code} />
          </div>
        </div>
        {!!displayValue && (
          <div className="center mx-auto max-w-[300px] gap-x-3 pt-6 text-center text-muted-foreground">
            <p className="line-clamp-1 break-all">{displayValue}</p>
            <Button
              onClick={() => {
                void void copyText(displayValue);
                toast.success(`Copied!`);
              }}
              className="px-3 py-3"
            >
              <MdContentCopy className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Template>
  );
}
