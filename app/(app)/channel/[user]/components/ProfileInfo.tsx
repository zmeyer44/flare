import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getTwoLetters, getNameToShow } from "@/lib/utils";
import { HiCheckBadge } from "react-icons/hi2";
import { type NDKUserProfile } from "@nostr-dev-kit/ndk";
import { Button } from "@/components/ui/button";

export default function ProfileInfo({
  profile,
  npub,
}: {
  profile: NDKUserProfile;
  npub: string;
}) {
  return (
    <div className="space-y-3">
      {/* Profile Image and name */}
      <div className="flex items-center justify-between">
        <div className="center group gap-x-3 rounded-sm rounded-r-full pr-1 text-foreground lg:gap-x-5">
          <Avatar className="center h-[48px] w-[48px] overflow-hidden rounded-[.55rem] bg-muted md:h-[60px] md:w-[60px] lg:h-[120px] lg:w-[120px]">
            <AvatarImage
              className="object-cover"
              src={profile?.image}
              alt={profile?.displayName}
            />
            <AvatarFallback className="text-[14px]">
              {getTwoLetters({ npub, profile })}
            </AvatarFallback>
          </Avatar>
          <div className="">
            <div className="flex items-center gap-1">
              <span className="truncate text-lg font-semibold lg:text-2xl">
                {getNameToShow({ npub, profile })}
              </span>
              {!!profile?.nip05 && (
                <HiCheckBadge className="h-[14px] w-[14px] text-primary lg:h-[18px] lg:w-[18px]" />
              )}
            </div>
            <p className="text-xs text-muted-foreground lg:text-sm">
              2.5k followers
            </p>
            <div className="hidden w-3/4 pt-2 lg:block">
              <div className="rounded-lg bg-muted">
                <p className="line-clamp-3 p-2 text-xs text-muted-foreground">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Quaerat illum, repudiandae odio vero accusamus rem ab. Sunt
                  iusto adipisci similique nobis officiis minus consequatur
                  numquam dolore cumque! Fuga, optio quaerat!
                </p>
              </div>
            </div>
          </div>
        </div>
        <Button>Follow</Button>
      </div>

      {/* Description and data */}
      <div className="lg:hidden">
        <div className="rounded-lg bg-muted">
          <p className="p-2 text-xs text-muted-foreground">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quaerat
            illum, repudiandae odio vero accusamus rem ab. Sunt iusto adipisci
            similique nobis officiis minus consequatur numquam dolore cumque!
            Fuga, optio quaerat!
          </p>
        </div>
      </div>
    </div>
  );
}
