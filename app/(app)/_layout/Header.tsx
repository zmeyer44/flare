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
    <header className="flex h-[var(--header-height)] shrink-0 grow-0">
      <div className="fixed z-header flex h-[var(--header-height)] w-full grow flex-col justify-between border-b-0 bg-background shadow">
        <div className="flex flex-1 items-stretch justify-between gap-x-4 px-5">
          <div className="flex w-[150px] items-center">
            <Link
              href="/"
              className="center justify-between gap-x-3 text-foreground sm:gap-x-5"
            >
              <Logo className="h-[26px] w-[26px] text-primary sm:h-[30px] sm:w-[30px]" />
              <div className="font-main text-xl font-semibold text-foreground">
                Flare
              </div>
            </Link>
          </div>
          <div className="flex grow items-center justify-center xl:justify-between">
            <div className="hidden w-full justify-center sm:flex">
              <Search />
            </div>
          </div>
          <div className="flex w-[150px] items-center justify-end gap-x-4">
            <AuthActions />
          </div>
        </div>
      </div>
    </header>
  );
}
