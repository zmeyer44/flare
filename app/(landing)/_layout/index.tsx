import { FloatingNav } from "./navbar";
import { BackgroundBeams } from "./background-beams";
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-[100svh] w-screen bg-background">
      <BackgroundBeams />
      {/* Header */}
      <FloatingNav navItems={[]} />

      <div className="relative flex flex-1 shrink-0 grow justify-center">
        <div className="isolate z-0 w-[100vw] flex-1 pb-5">{children}</div>
      </div>
    </main>
  );
}
