"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import RotaryButton from "./_components/RotaryButton";
import Logo from "@/assets/Logo";
import {
  RiFlashlightLine,
  RiGovernmentLine,
  RiLoginCircleFill,
  RiLogoutCircleRLine,
  RiCashLine,
  RiArrowLeftRightLine,
} from "react-icons/ri";
import {
  CashuMint,
  Token,
  CashuWallet,
  MintKeys,
  getEncodedToken,
  generateNewMnemonic,
} from "@cashu/cashu-ts";
import SendModal from "./_components/SendModal";
import useCashuToken from "./_hooks/useCashuToken";
import { useWallet } from "./_providers/walletProvider";
import { api } from "@/lib/trpc/api";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { CurrentUserWithMintType } from "@/lib/server-actions/user";
import { toast } from "sonner";
import { getTokenInfo } from "./_providers/walletProvider/proofs";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";

type Transaction = {
  type: "lightning" | "ecash";
  direction: "in" | "out";
  amount: number;
};

export default function Page({ dbUser }: { dbUser: CurrentUserWithMintType }) {
  const { claimToken } = useWallet();
  const [loading, setLoading] = useState(false);
  // Cashu token hook
  const {
    token,
    setToken,
    tokenInfo,
    setTokenInfo,
    trustModal,
    setTrustModal,
  } = useCashuToken();

  const {
    data: hasMint,
    isLoading: loadingHasMint,
    isSuccess: hasFetchedMint,
    refetch: checkIfUserHasMints,
  } = api.wallet.hasMints.useQuery(undefined, {
    enabled: !!dbUser,
  });
  const { mutateAsync: handleAddMint } = api.wallet.addMint.useMutation({
    onSettled: (data) => {
      console.log("Settled", data);
      void checkIfUserHasMints();
    },
  });
  const {
    data: proofs,
    isLoading: loadingTrnasactions,
    refetch: refetchTransactions,
  } = api.wallet.getTransactions.useQuery(undefined, {
    enabled: !!dbUser,
  });

  useEffect(() => {
    console.log("in hasFetchedMint effect", hasFetchedMint);
    if (hasFetchedMint && !hasMint) {
      console.log("adding mint");
      const promise = handleAddMint({
        mintUrl: process.env.NEXT_PUBLIC_DEFAULT_MINT_URL as string,
        customName: "Enuts Mint",
        default: true,
      });
      toast.promise(promise, {
        loading: "Loading...",
        success: (data) => {
          return `Mint Added`;
        },
        error: "Error",
      });
    } else if (hasMint) {
      //   handleSetMint(hasMint.mintUrl);
    }
  }, [hasFetchedMint]);

  const {
    data: balance,
    isLoading: loadingbalance,
    refetch: refetchBalance,
  } = api.wallet.getBalance.useQuery(
    {
      used: false,
    },
    {
      enabled: !!dbUser,
      initialData: 0,
    },
  );

  async function receiveECash(encodedToken: string) {
    setLoading(true);
    try {
      const claimedToken = await claimToken(encodedToken).catch(console.log);
      if (claimedToken && !claimedToken.error) {
        refetchBalance();
        toast.success("Token Claimed!");
        return true;
      } else {
        if (claimedToken && claimedToken.errorMessage) {
          toast.error(claimedToken.errorMessage);
        } else {
          toast.error("Error occured");
        }
        return false;
      }
      setToken("");
      const info = getTokenInfo(encodedToken);
      console.log("token info", info);

      // add as history entry (receive ecash)
      // await addToHistory({
      //   amount: info.value,
      //   type: 1,
      //   value: encodedToken,
      //   mints: info.mints,
      // });
    } catch (err) {
    } finally {
      setLoading(true);
    }
    return false;
  }

  const transactions: Transaction[] =
    proofs?.map((p) => ({
      amount: p.amount ?? 0,
      direction: p.amount ? "out" : "in",
      type: "ecash",
    })) ?? [];

  return (
    <div className="flex h-screen w-screen scale-100 transform flex-col bg-gradient-to-bl from-gray-400 to-gray-500">
      <div className="flex h-[45vh] w-full p-4">
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[3rem] bg-gradient-to-bl from-zinc-800 to-zinc-950">
          {/* <div className="absolute inset-0 rounded-[3rem] border-b-2 border-r-2 border-gray-50 border-opacity-70"></div> */}
          <div className="flex w-full items-center justify-between border-b border-orange-600 border-opacity-40 px-[3rem] py-[4px]">
            <Link
              href="/"
              className="center justify-between gap-x-1 text-foreground opacity-60"
            >
              <Logo className="h-[14px] w-[14px] text-primary" />
              <div className="mt-[2px] font-main text-[12px] font-semibold uppercase leading-none text-primary">
                Flare
              </div>
            </Link>
            <div className="flex items-center gap-x-2 font-main text-[12px] font-semibold uppercase text-primary opacity-60">
              {!!hasMint && (
                <div className="center flex gap-x-1">
                  <RiGovernmentLine className="h-[14px] w-[14px] text-primary" />
                  <p className="mt-[2px] line-clamp-1 leading-none">
                    {hasMint?.customName ?? hasMint.mintUrl}
                  </p>
                </div>
              )}
              <p className="mt-[2px] leading-none">$42,432</p>
            </div>
          </div>
          <div className="center font-major-mono flex-col pt-14 text-primary">
            <h1 className="font-audiowide text-6xl">{formatNumber(balance)}</h1>
            <p className="font-main">balance</p>
          </div>
          <div className="flex w-full flex-1 flex-col overflow-hidden px-3 pb-3 font-mono">
            <div className="flex items-center gap-x-1 text-primary">
              <h3 className="font-main">txns</h3>
              <RiArrowLeftRightLine className="h-4 w-4" />
            </div>
            <ul className="mt-1 flex-1 space-y-2 overflow-y-auto rounded-xl rounded-b-[39px] border border-primary bg-orange-800/30 p-3 text-primary scrollbar-none">
              {transactions.map((e, idx) => (
                <li key={idx} className="flex items-center gap-x-2">
                  <div className="flex items-center gap-x-1">
                    {e.direction === "in" ? (
                      <RiLoginCircleFill className="h-4 w-4" />
                    ) : (
                      <RiLogoutCircleRLine className="h-4 w-4" />
                    )}
                    {e.type === "ecash" ? (
                      <RiCashLine className="h-4 w-4" />
                    ) : (
                      <RiFlashlightLine className="h-4 w-4" />
                    )}
                  </div>
                  <div className="h-0 flex-1 border-b-2 border-dotted border-primary/60"></div>
                  <div className="flex items-center ">
                    <p className="text-[14px] leading-none">
                      {`${e.direction === "in" ? "+" : "-"}${formatNumber(
                        e.amount,
                      )}`}
                      <span className="ml-1 text-[9px]">sats</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="relative flex h-[55vh] w-full">
        <div className="absolute bottom-0 right-0 pb-3 pr-5 text-right">
          <p className="text-lg font-semibold uppercase text-gray-600">Flare</p>
          <p className="text-sm font-normal text-gray-600">v.1.6.3</p>
        </div>
        {hasMint ? (
          <>
            <RotaryButton
              mint={hasMint}
              onScan={(token) => receiveECash(token)}
              loading={loading}
            />
            {/* <Button
              onClick={() =>
                receiveECash(
                  "cashuAeyJ0b2tlbiI6W3sibWludCI6Imh0dHBzOi8vbGVnZW5kLmxuYml0cy5jb20vY2FzaHUvYXBpL3YxL0FwdEROQUJOQlh2OGdwdXl3aHg2TlYiLCJwcm9vZnMiOlt7ImlkIjoiT3k3RnVGRGFzaHpvIiwiYW1vdW50IjoyLCJzZWNyZXQiOiJETEhZTk04c0RWaU1oN0dTcDlxTEVUbkwxL2RQNjlIN1hudW5ydG04RWNBPSIsIkMiOiIwMzJmYWM3Mjg5NDEwNDE1MDRiYzZiYjExNDI1ZWFmMWY1NDYyM2U5ZTA3MDgxMDdhOTVkMzNmYTQ2NmZjYjUzYzkifSx7ImlkIjoiT3k3RnVGRGFzaHpvIiwiYW1vdW50Ijo4LCJzZWNyZXQiOiJuMkxXQ1ZZSnVJc0NEWE1RL1JmN3hLZ2lBOUYvUjdQOEVpb012eFgvVjdJPSIsIkMiOiIwMzlmZDRkYzFiNTc1ODI5ZGY1ZmVhZWIyM2E2ZDE4MjQzOGI1OGUxYjE0MTI2ODczMjI1NmI3NTIxMDNlZGQzYTkifV19XSwibWVtbyI6IlRlc3RlciJ9",
                )
              }
            >
              Test Receive
            </Button>
            <Button onClick={() => test()}>Test</Button> */}
          </>
        ) : (
          <div className="center w-full flex-col gap-y-3 text-gray-600">
            <Spinner />
            <p className="text-lg font-normal uppercase text-gray-600">
              [Initializing Mint]
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
