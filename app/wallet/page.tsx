import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import RotaryButton from "./_components/RotaryButton";
import Logo from "@/assets/Logo";

export default function Page() {
  return (
    <div className="flex h-screen w-screen scale-100 transform flex-col bg-gradient-to-bl from-gray-400 to-gray-500">
      <div className="flex h-[45vh] w-full p-4">
        <div className="relative h-full w-full overflow-hidden rounded-[3rem] bg-gradient-to-bl from-zinc-800 to-zinc-950">
          <div className="absolute inset-0 rounded-[3rem] border-b-2 border-r-2 border-gray-50 border-opacity-70"></div>
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
