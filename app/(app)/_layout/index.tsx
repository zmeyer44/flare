import dynamic from "next/dynamic";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import Header from "./Header";

const CommandDialog = dynamic(() => import("./_components/CommandDialog"), {
  ssr: false,
});
const MobileBanner = dynamic(() => import("./MobileBanner"), {
  ssr: false,
});

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="app-layout min-h-[100svh] w-screen bg-background sm:absolute sm:inset-0">
      <div className="f1">
        {/* Header */}
        <Header />
      </div>
      <div className="f2">
        <Sidebar />
      </div>
      <div className="relative flex flex-1 shrink-0 grow justify-center sm:w-[calc(100vw_-_var(--sidebar-width))] ">
        <div className="w-[100vw] flex-1 pb-5 sm:w-[calc(100vw_-_var(--sidebar-width))] ">
          {children}
        </div>
      </div>
      {/* Mobile Banner */}
      <MobileBanner />
      {/* BottomNav */}
      <BottomNav />
      <CommandDialog />
    </main>
  );
}
