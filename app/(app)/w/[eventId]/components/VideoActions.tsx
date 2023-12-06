"use client";
import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LikeToggleButton from "@/components/custom-buttons/LikeToggleButton";
import { cn, getTwoLetters, getNameToShow } from "@/lib/utils";
import { HiCheckBadge } from "react-icons/hi2";
import { RiMore2Fill } from "react-icons/ri";
import DropDownOptions from "@/components/custom-buttons/DropDownOptions";

export default function VideoActions() {
  const npub = "";
  const profile = {
    name: "Zach",
    displayName: "Zach Meyer",
    image:
      "https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fwill-the-p_7249fefe2495a5a6a4725d481e381b12_256x256_qual_100.webp&w=256&q=100",
    nip05: "zach@flockstr.com",
  };

  const [likeCount, setLikeCount] = useState(0);
  return (
    <div className="space-y-2.5 py-2">
      {/* Title Section */}
      <div className="flex justify-between">
        <h1 className="text-[1.3rem] text-xl font-semibold">
          New YouTube Video
        </h1>
      </div>

      {/* Detials Section */}
      <div className="flex justify-between">
        {/* Channel */}
        <div className="flex items-center gap-5">
          {/* Channel Section */}
          <div className="flex">
            <Link
              href={`/${npub}`}
              className="center group gap-x-3 rounded-sm rounded-r-full pr-1 text-foreground hover:shadow"
            >
              <Avatar className="center h-[40px] w-[40px] overflow-hidden rounded-[.5rem] bg-muted">
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
                  <span className="text-[16px] font-semibold">
                    {getNameToShow({ npub, profile })}
                  </span>
                  {!!profile?.nip05 && (
                    <HiCheckBadge className="h-[14px] w-[14px] text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">2.5k followers</p>
              </div>
            </Link>
          </div>
          {/* Channel Action Section */}
          <div className="flex items-center gap-2">
            <Button size={"sm"} className="px-4 font-bold">
              Follow
            </Button>
            <Button
              size={"sm"}
              className="px-4 font-bold"
              variant={"secondary"}
            >
              Zap
            </Button>
          </div>
        </div>
        {/* Video actions */}
        <div className="flex items-center gap-3 text-muted-foreground">
          <LikeToggleButton
            likeCount={likeCount}
            onClick={(action) => {
              if (action === "+") {
                setLikeCount((prev) => prev + 1);
              } else {
                setLikeCount((prev) => prev - 1);
              }
            }}
          />
          <DropDownOptions />
        </div>
      </div>

      {/* Metadata Section */}
      <div
        className={cn(
          "rounded-xl bg-muted p-3",
          true && "cursor-pointer transition-all hover:bg-muted-foreground/30",
        )}
      >
        <div className="flex items-center gap-x-1.5 text-[13px] font-semibold text-foreground">
          <p>44,053 views</p> <span>•</span>
          <p>44,053 views</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsam
            tenetur sit officiis quibusdam inventore recusandae adipisci
            perspiciatis? Id, nostrum. Sequi laudantium cumque quibusdam id
            autem odio doloribus minima fugit neque!
          </p>
        </div>
        <button className="text-xs font-medium leading-none">
          <span>See more...</span>
        </button>
      </div>

      {/* Comments Section */}
      <div className="">
        <div className="flex items-center">
          <h2 className="font-semibold text-foreground">123 Comments</h2>
        </div>
      </div>
    </div>
  );
}
