"use client";

import { useEffect, useState, type ReactNode } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiOutlineChevronDown, HiXMark } from "react-icons/hi2";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Template from "./template";
import { QrReader } from "react-qr-reader";
import QRFrameIcon from "@/assets/icons/QRFrameIcon";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";

type ScanModalProps = {
  onCapture: (data: string) => void;
  onDismiss?: () => void;
  loading?: boolean;
};

export default function ScanModal({ onCapture, loading }: ScanModalProps) {
  const [input, setInput] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  function handleSubmit(val: string) {
    setHasSubmitted(true);
    onCapture(val);
  }

  return (
    <Template title="Scan Cashu Token">
      <div className="pb-10">
        <div className="center relative mx-auto aspect-square max-w-[300px]">
          <QrReader
            onResult={(result, error) => {
              if (!!result) {
                const value = result["text"] as string;

                if (value.startsWith("cashu") || !hasSubmitted) {
                  setInput(value);
                  handleSubmit(value);
                  // setInput(value);
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
        <div className="mx-auto mt-6 flex max-w-[300px] flex-col text-left">
          <Label>Token</Label>
          <Input
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder="cashu..."
          />
          <Button
            loading={loading}
            disabled={
              !input.startsWith("cashu") || input.length < 20 || loading
            }
            onClick={() => handleSubmit(input)}
            className="mt-6"
          >
            Submit
          </Button>
        </div>
      </div>
    </Template>
  );
}
