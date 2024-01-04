import ProfilePage from "./ProfilePage";
import { nip19 } from "nostr-tools";
import { getUserFromNip05 } from "@/lib/server-actions/user";

type ProfilePageProps = {
  user: string;
};
export default async function Page({ params }: { params: ProfilePageProps }) {
  const { user: name } = params;

  if (name.startsWith("npub1")) {
    const { type, data } = nip19.decode(name);
    if (type !== "npub") {
      throw new Error("Invalid npub");
    }
    const pubkey = data.toString();
    return <ProfilePage pubkey={pubkey} />;
  }
  const user = await getUserFromNip05(name);
  if (user) {
    return <ProfilePage pubkey={user.pubkey} name={name} />;
  }
}
