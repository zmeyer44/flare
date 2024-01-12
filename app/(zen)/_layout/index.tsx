"use client";

import { useState } from "react";
import { useKeyboardShortcut } from "@/lib/hooks/useKeyboardShortcut";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const backgrounds = [
    "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=3296&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1682686581660-3693f0c588d2?q=80&w=3271&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1682687220067-dced9a881b56?q=80&w=3350&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1619266465172-02a857c3556d?q=80&w=3431&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1630061945673-6b40216122de?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  const [background, setBackground] = useState(
    typeof window !== "undefined"
      ? localStorage?.getItem("bg-image-url") ?? backgrounds[0]
      : backgrounds[0],
  );
  useKeyboardShortcut(["shift", " "], () => {
    const currentIndex = backgrounds.findIndex((b) => b === background) ?? 0;
    if (currentIndex === backgrounds.length - 1) {
      setBackground(backgrounds[0]!);
    } else {
      setBackground(backgrounds[currentIndex + 1]!);
    }
  });

  return (
    <main className="min-h-[100svh] w-screen">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
      {/* Header */}
      {/* <FloatingNav navItems={[]} /> */}
      <div className="relative flex flex-1 shrink-0 grow justify-center">
        <div className="isolate z-0 w-[100vw] flex-1">{children}</div>
      </div>
    </main>
  );
}
