import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function Split({ shares }: { shares: [number, number] }) {
  console.log("rerendering", shares);
  const sectionAShare = shares[0];
  const sectionBShare = shares[1];
  function getShareAsPercent(share: number) {
    const val = Math.round(share * 100);
    if (val > 100) {
      return `${100}%`;
    }
    return `${val}%`;
  }
  return (
    <div className="flex items-center gap-x-2">
      <Label>{getShareAsPercent(sectionAShare)}</Label>
      <div className="flex grow gap-x-1">
        <div className="flex h-[6px] flex-1 flex-row-reverse rounded-full bg-muted">
          <div
            className={cn(
              `z-10 flex-none rounded-full bg-primary`,
              "min-w-[10px] max-w-full",
            )}
            style={{
              width: getShareAsPercent(sectionAShare),
            }}
          ></div>
        </div>
        <div className="flex h-[6px] flex-1 rounded-full bg-muted">
          <div
            className={cn(
              `z-10 flex-none rounded-full bg-primary`,
              "min-w-[10px] max-w-full",
            )}
            style={{
              width: getShareAsPercent(sectionBShare),
            }}
          ></div>
        </div>
      </div>
      <Label>{getShareAsPercent(sectionBShare)}</Label>
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="text-xs text-muted-foreground">{children}</p>;
}
