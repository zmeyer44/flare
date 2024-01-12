"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  RiHomeSmile2Line,
  RiNotification3Line,
  RiMenu3Fill,
  RiAddFill,
  RiSearchLine,
  RiStickyNoteLine,
  RiArrowDownSLine,
} from "react-icons/ri";
import { TbMail } from "react-icons/tb";

import { HiOutlineMail } from "react-icons/hi";
import { IconType } from "react-icons";
import { cn, getTwoLetters, getNameToShow } from "@/lib/utils";
import { HiCheckBadge } from "react-icons/hi2";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCount, truncateText } from "@/lib/utils";
import type { NDKUser } from "@nostr-dev-kit/ndk";
import useProfile from "@/lib/hooks/useProfile";

type MenuProps = {
  currentUser: NDKUser;
};
export default function Menu({ currentUser }: MenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const npub = currentUser.npub;
  const { profile } = useProfile(currentUser.pubkey);
  const menu: { label: string; icon: IconType }[] = [
    {
      label: "Notes",
      icon: RiHomeSmile2Line,
    },
    {
      label: "Notifications",
      icon: RiNotification3Line,
    },
    {
      label: "Messages",
      icon: TbMail,
    },
    {
      label: "Search",
      icon: RiSearchLine,
    },
    {
      label: "Deck",
      icon: RiStickyNoteLine,
    },
  ];
  return (
    <div className="rounded-2xl bg-muted/80 px-5 py-3 backdrop-blur transition-all">
      <div className="flex justify-between gap-x-10 sm:justify-start">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Flare</h1>
        </div>
        <div className="-mr-1 flex items-center gap-x-1">
          <Button
            //   onClick={() => setOpen(true)}
            variant="default"
            size="icon"
            className={cn(
              "center relative h-7 w-7 rounded-full text-foreground",
            )}
          >
            <RiAddFill className="h-[18px] w-[18px] text-foreground" />
          </Button>
          <Button
            onClick={() => setMenuOpen((prev) => !prev)}
            variant="ghost"
            size="icon"
            className={cn(
              "center relative h-8 w-8 rounded-full text-foreground",
            )}
          >
            <RiMenu3Fill className="h-[18px] w-[18px] text-foreground" />
          </Button>
        </div>
      </div>
      <div
        className={cn(
          "flex flex-col overflow-hidden transition-all",
          menuOpen ? "max-h-[500px]" : "max-h-0",
        )}
      >
        <div className="flex items-center justify-between pt-2">
          <div className="center group gap-x-2 overflow-hidden text-foreground">
            <Avatar className="center h-[34px] w-[34px] overflow-hidden rounded-full bg-muted">
              <AvatarImage
                className="object-cover"
                src={profile?.image}
                alt={profile?.displayName}
              />
              <AvatarFallback className="text-[15px]">
                {getTwoLetters({ npub, profile })}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1">
                <span className="line-clamp-1 break-all text-[14px] font-semibold">
                  {getNameToShow({ npub, profile })}
                </span>
                {!!profile?.nip05 && (
                  <HiCheckBadge className="h-[14px] w-[14px] shrink-0 text-primary" />
                )}
              </div>
            </div>
          </div>
          <Button
            onClick={() => setMenuOpen((prev) => !prev)}
            variant="ghost"
            size="icon"
            className={cn(
              "center relative h-8 w-8 rounded-full text-foreground",
            )}
          >
            <RiArrowDownSLine className="h-[18px] w-[18px] text-foreground" />
          </Button>
        </div>
        <ul className="pt-2">
          {menu.map((i) => (
            <li
              key={i.label}
              className="flex cursor-pointer items-center gap-x-2 rounded-lg px-2 py-2 transition-all hover:bg-muted"
            >
              <i.icon className="h-5 w-5" />
              <p className="text-sm font-semibold">{i.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
