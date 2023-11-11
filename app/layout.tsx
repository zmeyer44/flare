import "./globals.css";
import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "./_providers";

const inter = Inter({ subsets: ["latin"] });
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});
const title = "TBD";
const description = "TBD";

export const metadata: Metadata = {
  title,
  description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true} className="">
      <body
        suppressHydrationWarning={true}
        className={cn(
          inter.className,
          interTight.variable,
          "antialiased w-full bg-background scrollbar-none"
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
