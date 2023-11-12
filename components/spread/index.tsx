import { cn } from "@/lib/utils";
export default function Spread({ share }: { share: number }) {
  const shareAsPercent = `${Math.trunc(share * 100)}%`;
  return (
    <div className="">
      <div className="h-[6px] mt-3 flex flex-auto rounded-full bg-muted">
        <div
          className={cn(
            `flex-none rounded-l-full z-10 rounded-r-[1px] bg-green-400`,
            "min-w-[10px]"
          )}
          style={{
            width: shareAsPercent,
          }}
        ></div>
        <div className="-my-[6px] mx-0.5 h-[18px] z-20 w-1 rounded-full bg-green-400"></div>
        <div className="flex-1 bg-red-400 rounded-r-full min-w-[10px]" />
      </div>
    </div>
  );
}
