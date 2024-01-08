"use client";
import Feed from "./components/Feed";
import Menu from "./components/Menu";
import SearchBar from "./components/SearchBar";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import Spinner from "@/components/spinner";

export default function Page() {
  const { currentUser, follows } = useCurrentUser();

  if (!currentUser) {
    return (
      <div className="center">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="mx-auto flex flex-col gap-x-6 gap-y-4 px-4 sm:flex-row sm:justify-center">
      <div className="sticky top-0 z-10 shrink-0 pt-4 sm:h-[80svh] md:max-w-[350px] md:flex-1">
        <div className="sm:flex sm:justify-end">
          <Menu currentUser={currentUser} />
        </div>
      </div>

      <Feed
        follows={Array.from(follows)}
        className="flex-2 sm:mt-[-100px] sm:pt-[100px]"
      />

      <div className="sticky top-0 hidden h-[80svh] min-w-[200px] max-w-[350px] flex-1 pt-4 lg:block">
        <SearchBar />
      </div>
    </div>
  );
}
