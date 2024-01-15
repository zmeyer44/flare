import { getCurrentUserWithMints } from "@/lib/server-actions/user";
import { redirect } from "next/navigation";
import WalletPage from "./WalletPage";
export default async function Page() {
  const currentUser = await getCurrentUserWithMints();
  if (!currentUser) {
    redirect("/");
  }
  return <WalletPage dbUser={currentUser} />;
}
