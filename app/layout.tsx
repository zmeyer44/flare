import "./globals.css";
import type { Metadata } from "next";
import { Inter, Inter_Tight, Monomaniac_One } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "./_providers";

const inter = Inter({ subsets: ["latin"] });
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});
const monomaniacOne = Monomaniac_One({
  subsets: ["latin"],
  variable: "--font-monomaniac-one",
  weight: ["400"],
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
    <html lang="en" suppressHydrationWarning={true} className="dark">
      <body
        suppressHydrationWarning={true}
        className={cn(
          inter.className,
          interTight.variable,
          monomaniacOne.variable,
          "w-full bg-background antialiased scrollbar-none",
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
