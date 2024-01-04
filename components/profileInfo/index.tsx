"use client";
import { ComponentProps } from "react";
import {
  cn,
  getTwoLetters,
  getNameToShow,
  formatCount,
  copyText,
  formatNumber,
} from "@/lib/utils";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HiCheckBadge } from "react-icons/hi2";

import useProfile from "@/lib/hooks/useProfile";

type ProfileInfoProps = {
  npub: string;
  link?: boolean;
  avatarClassName?: string;
} & React.HTMLAttributes<HTMLAnchorElement>;
export default function ProfileInfo({
  npub,
  link = true,
  className,
  avatarClassName,
  ...props
}: ProfileInfoProps) {
  const pubkey = npub;
  const { profile, followers } = useProfile(pubkey, {
    fetchFollowerCount: true,
  });

  const Component = () => {
    return (
      <>
        <Avatar
          className={cn(
            "center h-[34px] w-[34px] overflow-hidden rounded-[.5rem] bg-muted sm:h-[40px] sm:w-[40px]",
            avatarClassName,
          )}
        >
          <AvatarImage
            className="object-cover"
            src={profile?.image}
            alt={profile?.displayName}
          />
          <AvatarFallback className="text-[12px]">
            {getTwoLetters({ npub, profile })}
          </AvatarFallback>
        </Avatar>
        <div className="">
          <div className="flex items-center gap-1">
            <span className="truncate text-[14px] font-semibold sm:text-[16px]">
              {getNameToShow({ npub, profile })}
            </span>
            {!!profile?.nip05 && (
              <HiCheckBadge className="h-[12px] w-[12px] text-primary sm:h-[14px] sm:w-[14px]" />
            )}
          </div>
          <p className="text-[11px] text-muted-foreground sm:text-xs">
            {!!followers.length && `${formatCount(followers.length)} followers`}
          </p>
        </div>
      </>
    );
  };
  return (
    <Link
      href={`/channel/${npub}`}
      className={cn(
        "center group gap-x-3 rounded-sm rounded-r-full pr-1 text-foreground hover:shadow",
        className,
      )}
      {...props}
    >
      <Component />
    </Link>
  );
}
