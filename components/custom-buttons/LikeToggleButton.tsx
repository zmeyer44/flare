"use client";
import { formatCount } from "@/lib/utils";
import {
  RiThumbUpFill,
  RiThumbDownFill,
  RiThumbUpLine,
  RiThumbDownLine,
} from "react-icons/ri";

type LikeToggleButton = {
  likeCount?: number;
  active?: "+" | "-";
  onClick: (action: "+" | "-") => void;
};
export default function LikeToggleButton({
  likeCount,
  active,
  onClick,
}: LikeToggleButton) {
  return (
    <div className="flex h-8 rounded-full border bg-muted">
      <button
        onClick={() => onClick("+")}
        className="flex flex-1 items-center gap-2 px-3 hover:text-foreground"
      >
        {active === "+" ? <RiThumbUpFill /> : <RiThumbUpLine />}
        {!!likeCount && (
          <span className="text-xs font-bold">{formatCount(likeCount)}</span>
        )}
      </button>
      <div className="h-full w-[1px] bg-muted-foreground/20"></div>
      <button
        onClick={() => onClick("-")}
        className="flex-1 px-3 hover:text-foreground"
      >
        {active === "-" ? <RiThumbDownFill /> : <RiThumbDownLine />}
      </button>
    </div>
  );
}
