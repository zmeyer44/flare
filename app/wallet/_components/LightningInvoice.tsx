"use client";
import { useState, useEffect } from "react";
import Template from "@/components/modals/template";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";

type LightningInvoiceModal = {
  onSubmit: (amount: number) => void;
};
export default function LightningInvoiceModal({
  onSubmit,
}: LightningInvoiceModal) {
  const [fee, setFee] = useState({ estimation: 0, isCalculating: false });
  const [amount, setAmount] = useState(0);
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);

  //   const handleFeeEstimation = async (lnurl: string) => {
  //     setFee(prev => ({ ...prev, isCalculating: true }))
  //     try {
  //         // check fee for payment to lnurl
  //         if (lnurl.length) {
  //             const lnurlInvoice = await getInvoiceFromLnurl(lnurl, +amount)
  //             if (!lnurlInvoice?.length) {
  //                 openPromptAutoClose({ msg: t('feeErr', { ns: NS.common, input: lnurl }) })
  //                 return setFee(prev => ({ ...prev, isCalculating: false }))
  //             }
  //             const estFee = await checkFees(mint.mintUrl, lnurlInvoice)
  //             setFee({ estimation: estFee, isCalculating: false })
  //             return setShouldEstimate(false)
  //         }
  //         // check fee for multimint swap
  //         if (isSwap && targetMint?.mintUrl.length) {
  //             const { pr } = await requestMint(targetMint.mintUrl, +amount)
  //             // const invoice = await getInvoice(hash)
  //             const estFee = await checkFees(mint.mintUrl, pr)
  //             setFee({ estimation: estFee, isCalculating: false })
  //             setShouldEstimate(false)
  //         }
  //     } catch (e) {
  //         l(e)
  //         openPromptAutoClose({ msg: t('requestMintErr', { ns: NS.error }) })
  //         setFee(prev => ({ ...prev, isCalculating: false }))
  //     }
  // }

  return (
    <Template title="Send Ecash">
      <div className="flex min-h-[60vh] flex-col gap-y-5">
        <div className="pb-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex-1 text-center">
              <div className="text-5xl font-bold tracking-tighter">
                <Input
                  placeholder="0"
                  autoFocus
                  pattern="[0-9]*"
                  className="invisible-input h-full border-0 bg-transparent text-center text-5xl font-bold  shadow-none file:border-0 file:bg-transparent placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setAmount(0);
                    }
                    const asNumber = parseInt(
                      e.target.value.replaceAll(",", ""),
                    );
                    if (isNaN(asNumber)) {
                      console.log("NAN");
                      return;
                    }
                    setAmount(asNumber);
                  }}
                  value={formatNumber(amount)}
                />
              </div>
              <div className="text-[0.70rem] uppercase text-muted-foreground">
                Satoshis
              </div>
            </div>
          </div>
        </div>
        <Button
          onClick={() => {
            setLoading(true);
            onSubmit(amount);
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
