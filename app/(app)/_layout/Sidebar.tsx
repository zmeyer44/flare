"use client";

import Link from "next/link";
import {
  RiSettings4Line,
  RiFireLine,
  RiWindyFill,
  RiTornadoFill,
} from "react-icons/ri";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dynamic from "next/dynamic";
import { IconType } from "react-icons";
import { usePathname } from "next/navigation";

const ZapButton = dynamic(() => import("./_components/ZapButton"), {
  ssr: false,
});
const UploadVideoButton = dynamic(
  () => import("./_components/UploadVideoButton"),
  {
    ssr: false,
  },
);
// const AddNoteButton = dynamic(() => import("./components/AddNoteButton"), {
//   ssr: false,
// });

type NavigationLink = {
  type: "link";
  href: string;
};
type NavigationButton = {
  type: "button";
  onClick: () => void;
};
type NavigationElement = {
  name: string;
  label: string;
  icon: IconType;
} & (NavigationLink | NavigationButton);

export default function Sidebar() {
  const pathname = usePathname();

  const navigation: NavigationElement[] = [
    {
      href: "/",
      name: "home",
      label: "Home",
      icon: RiFireLine,
      type: "link",
    },
    {
      href: "/feed",
      name: "activity",
      label: "Activity",
      icon: RiWindyFill,
      type: "link",
    },
    // {
    //   href: "/playlists",
    //   name: "playlists",
    //   label: "Playlists",
    //   icon: RiTornadoFill,
    //   type: "link",
    // },
  ];
  return (
    <nav className="z-header- hidden h-[calc(100svh_-_var(--header-height))] w-[var(--sidebar-width)] flex-col  sm:flex">
      <div className="fixed bottom-0 flex h-[calc(100svh_-_var(--header-height))] w-[var(--sidebar-width)]  flex-col border-r">
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col items-center gap-y-2 py-4">
            {navigation.map((item) => {
              if (item.type === "link") {
                return (
                  <NavItem
                    key={item.name}
                    {...item}
                    active={pathname === item.href}
                  />
                );
              } else {
                return (
                  <TooltipProvider key={item.name}>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger>
                        <div
                          className={cn(
                            "center group relative min-h-[48px] min-w-[48px] rounded-lg hover:bg-muted",
                            false
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <item.icon
                            className={cn("h-6 w-6 shrink-0")}
                            aria-hidden="true"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent align="start">
                        <p>Coming Soon</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              }
            })}
            <ZapButton />
            <div className="center py-2">
              <UploadVideoButton />
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-end p-4">
          <NavItem
            href="/account"
            name="settings"
            active={false}
            icon={RiSettings4Line}
          />
        </div>
      </div>
    </nav>
  );
}

type NavItemProps = {
  name: string;
  href: string;
  active: boolean;
  icon: IconType;
};

function NavItem({ name, href, active, icon: Icon }: NavItemProps) {
  const pathname = usePathname();

  return (
    <div className="center relative w-full">
      <Link
        href={href}
        className={cn(
          "center group relative min-h-[48px] min-w-[48px] rounded-lg  hover:bg-muted",
          href === pathname
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Icon className={cn("h-6 w-6 shrink-0")} aria-hidden="true" />
      </Link>
      {active && (
        <div className="absolute left-[-4px] h-10 w-[8px] rounded-full bg-primary" />
      )}
    </div>
  );
}
