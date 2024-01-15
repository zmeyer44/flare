import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import RotaryButton from "./_components/RotaryButton";
import Logo from "@/assets/Logo";
import {
  RiFlashlightLine,
  RiFileList3Line,
  RiLoginCircleFill,
  RiLogoutCircleRLine,
  RiCashLine,
  RiArrowLeftRightLine,
} from "react-icons/ri";
import {
  CashuMint,
  CashuWallet,
  MintKeys,
  getEncodedToken,
  generateNewMnemonic,
} from "@cashu/cashu-ts";

const wallet = new CashuWallet(
  new CashuMint(
    "https://legend.lnbits.com/cashu/api/v1/AptDNABNBXv8gpuywhx6NV",
  ),
  {},
);

const { pr, hash } = await wallet.requestMint(200);
const nemonic = generateNewMnemonic();
type Transaction = {
  type: "lightning" | "ecash";
  direction: "in" | "out";
  amount: number;
};

export default function Page() {
  const transactions: Transaction[] = [
    {
      amount: 123244,
      direction: "in",
      type: "ecash",
    },
    {
      amount: 3443,
      direction: "out",
      type: "ecash",
    },
    {
      amount: 93244,
      direction: "in",
      type: "lightning",
    },
    {
      amount: 44,
      direction: "in",
      type: "lightning",
    },
    {
      amount: 10000,
      direction: "in",
      type: "lightning",
    },
    {
      amount: 2121,
      direction: "out",
      type: "lightning",
    },
    {
      amount: 10033,
      direction: "in",
      type: "ecash",
    },
  ];
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
            <div className="font-main text-[12px] font-semibold uppercase text-primary/70">
              <p className="mt-[2px] leading-none">$42,432</p>
            </div>
          </div>
          <div className="center font-major-mono flex-col pt-14 text-primary">
            <h1 className="font-audiowide text-6xl">{formatNumber(403423)}</h1>
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
        <RotaryButton />
      </div>
    </div>
  );
}
