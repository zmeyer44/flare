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
    return false;
  }
}
export async function authEvent(ndk: NDK) {
  log("func", "authEvent");
  try {
    const pubkey = ndk.activeUser?.pubkey;
    if (!pubkey) {
      throw new Error("No public key provided!");
    }
    const eventToPublish = new NDKEvent(ndk, {
      content: "",
      tags: [
        ["u", process.env.NEXT_PUBLIC_AUTH_REQ_URL as string],
        ["method", "GET"],
      ],
      kind: 27235,
      pubkey,
      created_at: unixTimeNowInSeconds(),
    } as NostrEvent);
    await eventToPublish.sign();
    // await eventToPublish.publish();
    return eventToPublish;
  } catch (err) {
    log("error", err);
    alert("An error has occured");
    return false;
  }
}
export async function follow(
  ndk: NDK,
  currentUser: NDKUser,
  pubkey: string,
  unfollow?: boolean,
) {
  const userContacts = await ndk.fetchEvent({
    kinds: [3],
    authors: [currentUser.pubkey],
  });
  if (!userContacts) return;
  let newTags = userContacts.tags;
  if (unfollow) {
    newTags = newTags.filter(([t, k]) =>
      t === "p" && k === pubkey ? false : true,
    );
  } else {
    newTags.push(["p", pubkey]);
  }
  const newEvent = {
    kind: 3,
    ...userContacts.rawEvent(),
    tags: newTags,
  };
  const newContacts = await createEvent(ndk, newEvent);
  return newContacts;
}
