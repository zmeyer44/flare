import dynamic from "next/dynamic";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Keystone from "./Keystone";

const CommandDialog = dynamic(() => import("./_components/CommandDialog"), {
  ssr: false,
});
const MobileBanner = dynamic(() => import("./MobileBanner"), {
  ssr: false,
});

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="app-layout w-screen sm:absolute sm:inset-0 bg-background min-h-[100svh]">
      <div className="f1">
        <Keystone />
        <Sidebar />
      </div>
      <div className="f2">
        {/* Header */}
        <Header />
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
