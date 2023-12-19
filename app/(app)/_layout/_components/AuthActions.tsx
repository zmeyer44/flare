"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useModal } from "@/app/_providers/modal/provider";
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
import { RiNotification4Line } from "react-icons/ri";
import { SiRelay } from "react-icons/si";
import StatusIndicator from "@/components/statusIndicator";
import { type NDKUser } from "@nostr-dev-kit/ndk";
import { truncateText, getTwoLetters } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useKeyboardShortcut } from "@/lib/hooks/useKeyboardShortcut";
import LoginModal from "@/components/modals/login";
import { useNDK } from "@/app/_providers/ndk";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { useSession, signIn } from "next-auth/react";
import { authEvent } from "@/lib/actions/create";

// const LoginModal = dynamic(() => import("@/components/Modals/Login"), {
//   ssr: false,
// });

export default function AuthActions() {
  const router = useRouter();
  const modal = useModal();
  const { data, status } = useSession();
  const { currentUser, logout, attemptLogin } = useCurrentUser();
  const { ndk } = useNDK();

  useKeyboardShortcut(["shift", "ctrl", "u"], () => {
    if (currentUser) {
      router.push(`/channel/${currentUser?.npub}`);
    } else {
      modal?.show(<LoginModal />);
    }
  });
  useKeyboardShortcut(["shift", "ctrl", "q"], () => {
    if (currentUser) {
      logout();
    }
  });
  useEffect(() => {
    if (ndk && !currentUser) {
      void attemptLogin();
    }
    if (ndk?.activeUser?.pubkey && status === "unauthenticated") {
      void attemptHttpLogin();
    }
  }, [ndk, status]);

  async function attemptHttpLogin() {
    if (!ndk) return;
    try {
      const event = await authEvent(ndk);
      if (!event) return;
      console.log("Submitting", event);
      const authRes = await signIn("nip-98", {
        event: JSON.stringify(event),
        redirect: false,
      });
      console.log("authRes", authRes);
    } catch (err) {
      console.log("Error http login");
    }
  }

  if (currentUser) {
    return (
      <>
        <Notifications user={currentUser} />
        <Relays />
        <UserMenu user={currentUser} logout={logout} />
      </>
    );
  }
  return (
    <>
      <Button
        onClick={() => modal?.show(<LoginModal />)}
        className="rounded-sm px-5 font-medium"
      >
        Login
      </Button>
    </>
  );
}

export function Notifications({ user }: { user: NDKUser }) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="center relative h-8 w-8 rounded-full bg-muted text-foreground"
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
