import Link from "next/link";
import Logo from "@/assets/Logo";
export default function Keystone() {
  return (
    <div className="center hidden sm:flex items-start">
      <Link
        href="/explore"
        className="center fixed h-[var(--header-top-height)] w-[var(--sidebar-width)] gap-x-3 border-r text-primary hover:text-primary/80"
      >
        <Logo className="h-[30px] w-[30px]" />
      </Link>
    </div>
  );
}
