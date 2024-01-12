import ZenLayout from "./_layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ZenLayout>{children}</ZenLayout>;
}
