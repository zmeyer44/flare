import Link from "next/link";
import { HiChevronRight } from "react-icons/hi";
import { cn } from "@/lib/utils";

type SupporterLabelProps = {
  sponsorName: string;
  href: string;
  className?: string;
};

export default function SupporterLabel({
  className,
  sponsorName,
  href,
}: SupporterLabelProps) {
  return (
    <div className={cn(className)}>
      <Link
        href={href}
        target="_blank"
        className="group inline-flex cursor-pointer space-x-6"
      >
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/20 transition-all group-hover:bg-primary/30 group-hover:ring-primary/40">
          Today's Sponsor
        </span>
        <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-muted-foreground transition-all group-hover:text-foreground">
          <span>{sponsorName}</span>
          <HiChevronRight
            className="h-5 w-5 text-muted-foreground/80 transition-all group-hover:text-foreground/80"
            aria-hidden="true"
          />
        </span>
      </Link>
    </div>
  );
}
