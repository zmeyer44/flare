import { nip19 } from "nostr-tools";
import NDK, {
  NDKEvent,
  type NDKPrivateKeySigner,
  type NDKTag,
  type NDKList,
  type NostrEvent,
  NDKUser,
} from "@nostr-dev-kit/ndk";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";

import { log } from "@/lib/utils";

export async function createEvent(
  ndk: NDK,
  event: {
    content: string;
    kind: number;
    tags: string[][];
  },
) {
  log("func", "createEvent");
  try {
    const pubkey = ndk.activeUser?.pubkey;
    if (!pubkey) {
      throw new Error("No public key provided!");
    }
    const eventToPublish = new NDKEvent(ndk, {
      ...event,
      pubkey,
      created_at: unixTimeNowInSeconds(),
    } as NostrEvent);
    await eventToPublish.sign();
    await eventToPublish.publish();
    return eventToPublish;
  } catch (err) {
    log("error", err);
    alert("An error has occured");
    return false;
  }
}
