"use client";

import Link from "next/link";
import {
  RiHome6Fill,
  RiCompassLine,
  RiCompass3Fill,
  RiQuestionAnswerLine,
  RiAddFill,
  RiSettings4Fill,
  RiCalendarEventFill,
  RiSettings4Line,
} from "react-icons/ri";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dynamic from "next/dynamic";
import { useModal } from "@/app/_providers/modal/provider";
import { IconType } from "react-icons";
import { usePathname } from "next/navigation";

// const ZapPickerModal = dynamic(() => import("@/components/Modals/ZapPicker"), {
//   ssr: false,
// });
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
  active: boolean;
} & (NavigationLink | NavigationButton);
const flockstrEvent = {
  created_at: 1697736945,
  content:
    "Officially announcing Flockstr. Check it out at https://flockstr.com",
  tags: [
    ["r", "https://flockstr.com"],
    ["client", "flockstr"],
  ],
  kind: 1,
  pubkey: "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
  id: "a867ff28711eeab4767fb6bacbb33dfe17b2b5bbbff98f8e57f90a85ea684b0a",
  sig: "37d8918e6da88d989467021a1f5809a3fbcab941ca1044d109ce261f29270d2d545aaa84297b7f224ae1ad7760263e50c317c24abc809034bcdb5c3260faf4b0",
};

export default function Sidebar() {
  const modal = useModal();
  const pathname = usePathname();

  const navigation: NavigationElement[] = [
    {
      href: "/explore",
      name: "explore",
      label: "Explore",
      icon: RiCompassLine,
      type: "link",
      active: true,
    },
    {
      href: "/events",
      name: "events",
      label: "Events",
      icon: RiCalendarEventFill,
      type: "link",
      active: true,
    },
    {
      href: "",
      name: "messages",
      label: "Messages",
      icon: RiQuestionAnswerLine,
      type: "link",
      active: false,
    },
    {
      onClick: () => {},
      name: "zap",
      label: "Zap Flockstr",
      icon: HiOutlineLightningBolt,
      type: "button",
      active: true,
    },
  ];
  return (
    <nav className="z-header- hidden h-[calc(100svh_-_var(--header-top-height))] w-[var(--sidebar-width)] flex-col sm:flex">
      <div className="fixed bottom-0 flex h-[calc(100svh_-_var(--header-top-height))] w-[var(--sidebar-width)]  flex-col border-r">
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col items-stretch gap-y-2 p-4">
            {navigation.map((item) => {
              if (item.type === "link") {
                if (item.active) {
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "center group relative min-h-[48px] min-w-[48px] rounded-lg hover:bg-muted",
                        pathname === item.href
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <item.icon
                        className={cn("h-6 w-6 shrink-0")}
                        aria-hidden="true"
                      />
                    </Link>
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
                                : "text-muted-foreground hover:text-foreground"
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
              } else {
                if (item.active) {
                  return (
                    <button
                      key={item.name}
                      onClick={item.onClick}
                      className={cn(
                        "center group relative min-h-[48px] min-w-[48px] rounded-lg hover:bg-muted",
                        false
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <item.icon
                        className={cn("h-6 w-6 shrink-0")}
                        aria-hidden="true"
                      />
                    </button>
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
                                : "text-muted-foreground hover:text-foreground"
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
              }
            })}
            <div className="center py-2">{/* <AddNoteButton /> */}</div>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-end p-4">
          <button
            className={cn(
              "center relative min-h-[48px] min-w-[48px] rounded-lg hover:bg-muted",

              "text-muted-foreground group-hover:text-foreground"
            )}
          >
            <RiSettings4Line
              className={cn("h-6 w-6 shrink-0")}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
