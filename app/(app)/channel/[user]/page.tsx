import ChannelPage from "./ChannelPage";
import { nip19 } from "nostr-tools";
import { getUserFromNip05 } from "@/lib/server-actions/user";

type ChannelPageProps = {
  user: string;
};
export default async function Page({ params }: { params: ChannelPageProps }) {
  const { user: name } = params;

  if (name.startsWith("npub1")) {
    const { type, data } = nip19.decode(name);
    if (type !== "npub") {
      throw new Error("Invalid npub");
    }
    const pubkey = data.toString();
    return <ChannelPage pubkey={pubkey} />;
  }
  const user = await getUserFromNip05(name);
  if (user) {
    return <ChannelPage pubkey={user.pubkey} name={name} />;
  }
}
