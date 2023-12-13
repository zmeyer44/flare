import "./globals.css";
import type { Metadata } from "next";
import { Inter, Inter_Tight, Poppins, DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { Providers } from "./_providers";

const inter = Inter({ subsets: ["latin"] });
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
});
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-main",
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Font files can be colocated inside of `app`
const afacad = localFont({
  src: "./_fonts/Afacad-VariableFont_wght.ttf",
  display: "swap",
  variable: "--font-main-one",
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
          poppins.variable,
          dmSans.variable,
          interTight.variable,
          afacad.variable,
          "w-full bg-background antialiased scrollbar-none",
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
