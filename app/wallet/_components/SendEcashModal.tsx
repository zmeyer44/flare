"use client";
import { useState, useEffect } from "react";
import Template from "@/components/modals/template";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";

type SendEcashModalProps = {
  onSubmit: (sats: number, memo?: string) => void;
  isLoading?: boolean;
};
export default function SendEcashModal({
  onSubmit,
  isLoading,
}: SendEcashModalProps) {
  const [ecashAmount, setEcashAmount] = useState(0);
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <Template title="Send Ecash">
      <div className="flex min-h-[60vh] flex-col gap-y-5 md:min-h-0">
        <div className="pb-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex-1 text-center">
              <div className="text-5xl font-bold tracking-tighter">
                <Input
                  placeholder="0"
                  autoFocus
                  pattern="[0-9]*"
                  className="invisible-input h-full border-0 bg-transparent text-center !text-5xl font-bold  shadow-none file:border-0 file:bg-transparent placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setEcashAmount(0);
                    }
                    const asNumber = parseInt(
                      e.target.value.replaceAll(",", ""),
                    );
                    if (isNaN(asNumber)) {
                      console.log("NAN");
                      return;
                    }
                    setEcashAmount(asNumber);
                  }}
                  value={formatNumber(ecashAmount)}
                />
              </div>
              <div className="text-[0.70rem] uppercase text-muted-foreground">
                Satoshis
              </div>
            </div>
          </div>
          <div className="w-full  pt-3 text-left">
            <Label>Memo</Label>
            <Textarea
              placeholder="Add a memo..."
              onChange={(e) => setMemo(e.target.value)}
              value={memo}
              className="auto-sizing"
            />
          </div>
        </div>
        <Button
          onClick={() => {
            setLoading(true);
            onSubmit(ecashAmount, memo);
          }}
          loading={loading}
          className="w-full gap-x-1"
        >
          <span>Send Ecash</span>
        </Button>
      </div>
    </Template>
  );
}
