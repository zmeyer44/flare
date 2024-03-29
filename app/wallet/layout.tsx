import { Major_Mono_Display, Audiowide } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "./_providers";

const majorMono = Major_Mono_Display({
  variable: "--font-major-mono",
  weight: ["400"],
  subsets: ["latin"],
});
const audiowide = Audiowide({
  variable: "--font-audiowide",
  weight: ["400"],
  subsets: ["latin"],
});
export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <main className={cn(majorMono.variable, audiowide.variable)}>
        {children}
      </main>
    </Providers>
  );
}
