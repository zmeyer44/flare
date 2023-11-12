import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function Split({ shares }: { shares: [number, number] }) {
  const sectionAShare = shares[0];
  const sectionBShare = shares[1];
  function getShareAsPercent(share: number) {
    return `${Math.trunc(share * 100)}%`;
  }
  return (
    <div className="flex items-center gap-x-2">
      <Label>{getShareAsPercent(sectionAShare)}</Label>
      <div className="flex grow gap-x-1">
        <div className="flex-1 flex-row-reverse h-[6px] flex rounded-full bg-muted">
          <div
            className={cn(
              `flex-none rounded-full z-10 bg-primary`,
              "min-w-[10px]"
            )}
            style={{
              width: getShareAsPercent(sectionAShare),
            }}
          ></div>
        </div>
        <div className="h-[6px] flex flex-1 rounded-full bg-muted">
          <div
            className={cn(
              `flex-none rounded-full z-10 bg-primary`,
              "min-w-[10px]"
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
  return <p className="text-muted-foreground text-xs">{children}</p>;
}
