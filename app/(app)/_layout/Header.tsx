import Link from "next/link";
import AuthActions from "./_components/AuthActions";
import Logo from "@/assets/Logo";
import dynamic from "next/dynamic";
import TopicsNav from "./_components/TopicsNav";

const Search = dynamic(() => import("./_components/Search"), {
  ssr: false,
});
export default function Header() {
  return (
    <header className="flex h-[var(--header-height)] shrink-0 grow-0 ">
      <div className="fixed z-header flex flex-col justify-between h-[var(--header-height)] pt-2 sm:pt-0 shadow w-full grow bg-background sm:w-[calc(100vw_-_var(--sidebar-width))] border-b-0">
        <div className="flex flex-1 items-stretch justify-between gap-x-4 px-5">
          <Link
            href="/explore"
            className="center justify-between gap-x-3 text-foreground"
          >
            <Logo className="h-[30px] w-[30px] text-primary sm:hidden" />
            <div className="font-condensed text-xl font-semibold text-foreground">
              Surge
            </div>
          </Link>
          <div className="flex grow items-center justify-end gap-x-4 xl:justify-between">
            <div className="hidden sm:flex">
              <Search />
            </div>
            <div className="flex items-center gap-x-4">
              <AuthActions />
            </div>
          </div>
        </div>
        <TopicsNav />
      </div>
    </header>
  );
}
