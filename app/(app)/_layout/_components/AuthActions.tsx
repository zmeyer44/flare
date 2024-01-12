"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { modal } from "@/app/_providers/modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiNotification4Line, RiSearchLine, RiAddFill } from "react-icons/ri";
import { SiRelay } from "react-icons/si";
import StatusIndicator from "@/components/statusIndicator";
import type { NDKUser } from "@nostr-dev-kit/ndk";
import { truncateText, getTwoLetters } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useKeyboardShortcut } from "@/lib/hooks/useKeyboardShortcut";
import AuthModal from "@/components/modals/auth";
import { useNDK } from "@/app/_providers/ndk";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { commandDialogAtom, odellModeAtom } from "./CommandDialog";
import { useAtom } from "jotai";
import { cn } from "@/lib/utils";

// const LoginModal = dynamic(() => import("@/components/Modals/Login"), {
//   ssr: false,
// });
export default function AuthActions() {
  const router = useRouter();
  const { currentUser, logout, attemptLogin } = useCurrentUser();
  const { ndk } = useNDK();

  if (currentUser) {
    return (
      <>
        <SearchButton className="md:hidden" />
        <Notifications className="max-md:hidden" user={currentUser} />
        <Relays />
        <NewUploadButton className="sm:hidden" />
        <UserMenu
          user={currentUser}
          logout={() => {
            logout();
          }}
        />
      </>
    );
  }
  return (
    <>
      <SearchButton className="md:hidden" />
      <Button
        onClick={() =>
          modal.show(<AuthModal step="create-account" />, {
            id: "auth",
          })
        }
        className="rounded-sm px-5 font-medium"
      >
        Login
      </Button>
    </>
  );
}

export function Notifications({
  user,
  className,
}: {
  user: NDKUser;
  className?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "center relative h-8 w-8 rounded-full bg-muted text-foreground",
              className,
            )}
          >
            <RiNotification4Line className="h-[18px] w-[18px] text-foreground" />
          </Button>
        </TooltipTrigger>
        <TooltipContent align="center">
          <p>Coming Soon</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
  //   return (
  //     <DropdownMenu>
  //       <DropdownMenuTrigger asChild>
  //         <Button
  //           variant="ghost"
  //           size="icon"
  //           className="center relative h-8 w-8 rounded-full bg-muted text-foreground"
  //         >
  //           <RiNotification4Line className="h-[18px] w-[18px] text-foreground" />
  //         </Button>
  //       </DropdownMenuTrigger>
  //       <DropdownMenuContent className="z-header+ w-56" align="end" forceMount>
  //         <DropdownMenuLabel className="font-normal">
  //           <div className="flex flex-col space-y-1">
  //             {user.profile?.displayName || user.profile?.name ? (
  //               <>
  //                 <p className="text-sm font-medium leading-none">
  //                   {user.profile?.displayName ?? user.profile.name}
  //                 </p>
  //                 <p className="text-xs leading-none text-muted-foreground">
  //                   m@example.com
  //                 </p>
  //               </>
  //             ) : (
  //               <p className="text-sm font-medium leading-none">
  //                 {truncateText(user.npub)}
  //               </p>
  //             )}
  //           </div>
  //         </DropdownMenuLabel>
  //         <DropdownMenuSeparator />
  //         <DropdownMenuGroup>
  //           <DropdownMenuItem>
  //             Profile
  //             <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
  //           </DropdownMenuItem>
  //           <DropdownMenuItem>
  //             Billing
  //             <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
  //           </DropdownMenuItem>
  //           <DropdownMenuItem>
  //             Settings
  //             <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
  //           </DropdownMenuItem>
  //           <DropdownMenuItem>New Team</DropdownMenuItem>
  //         </DropdownMenuGroup>
  //         <DropdownMenuSeparator />
  //         <DropdownMenuItem>
  //           Log out
  //           <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
  //         </DropdownMenuItem>
  //       </DropdownMenuContent>
  //     </DropdownMenu>
  //   );
}
export function SearchButton({ className }: { className?: string }) {
  const [open, setOpen] = useAtom(commandDialogAtom);
  return (
    <Button
      onClick={() => setOpen(true)}
      variant="ghost"
      size="icon"
      className={cn(
        "center relative h-8 w-8 rounded-full bg-muted text-foreground",
        className,
      )}
    >
      <RiSearchLine className="h-[18px] w-[18px] text-foreground" />
    </Button>
  );
}
export function NewUploadButton({ className }: { className?: string }) {
  return (
    <Link href="/new-video">
      <Button
        variant="default"
        size="icon"
        className={cn("center relative h-8 w-8 rounded-full", className)}
      >
        <RiAddFill className="h-[18px] w-[18px] text-foreground" />
      </Button>
    </Link>
  );
}
export function Relays() {
  const { ndk } = useNDK();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="center relative h-8 w-8 rounded-full bg-muted text-foreground"
        >
          <SiRelay className="h-[18px] w-[18px] text-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-header+ w-56" align="end" forceMount>
        {ndk?.explicitRelayUrls?.map((r) => (
          <DropdownMenuGroup key={r}>
            <DropdownMenuItem className="flex items-center gap-x-2 overflow-hidden">
              <StatusIndicator status="online" />
              <span className="w-full truncate">{r}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Manage Relays
          <DropdownMenuShortcut>⇧⌘M</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export function UserMenu({
  user,
  logout,
}: {
  user: NDKUser;
  logout: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profile?.image} alt={user.npub} />
            <AvatarFallback>{getTwoLetters(user)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-header+ w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {user.profile?.displayName || user.profile?.name ? (
              <>
                <p className="text-sm font-medium leading-none">
                  {user.profile?.displayName ?? user.profile.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.profile?.nip05 ?? truncateText(user.npub)}
                </p>
              </>
            ) : (
              <p className="text-sm font-medium leading-none">
                {truncateText(user.npub)}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link
              href={`/channel/${user.npub}`}
              className="flex w-full justify-between"
            >
              Profile
              <DropdownMenuShortcut>⇧⌘U</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem>
            <Link href="/" className="flex w-full justify-between">
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
