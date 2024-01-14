"use client";

import { useEffect, type ReactNode } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiOutlineChevronDown, HiXMark } from "react-icons/hi2";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Template from "./template";
import { QrReader } from "react-qr-reader";
import QRFrameIcon from "@/assets/icons/QRFrameIcon";
import { Button } from "../ui/button";

type ScanModalProps = {
  onCapture: (data: string) => void;
  onDismiss?: () => void;
};

export default function ScanModal({ onCapture, onDismiss }: ScanModalProps) {
  return (
    <Template title="Scan Lightning invoice">
      <div className="pb-10">
        <div className="center relative mx-auto aspect-square max-w-[300px]">
          <QrReader
            onResult={(result, error) => {
              if (!!result) {
                const value = result["text"] as string;
                if (value.length === 16) {
                  onCapture(value);
                }
              }
              if (!!error) {
                console.info(error);
              }
            }}
            className="mx-auto w-full max-w-[300px] overflow-hidden rounded-xl"
            containerStyle={{ width: "100%" }}
            constraints={{
              aspectRatio: 1,
              facingMode: {
                ideal: "environment",
              },
            }}
          />
          <QRFrameIcon className="absolute inset-0 mx-auto h-1/2 w-1/2 translate-y-1/2 text-primary" />
        </div>
        {!!onDismiss && (
          <Button onClick={onDismiss} className="mt-6" variant={"secondary"}>
            Dismiss
          </Button>
        )}
      </div>
    </Template>
  );
}
