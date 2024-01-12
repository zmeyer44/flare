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
export async function addEventToList(
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

const multipleTag = ["a", "p", "e"];
export async function updateList(
  ndk: NDK,
  list: NostrEvent,
  newTags: [string, string][],
) {
  let tags = list.tags;
  for (const [key, value] of newTags) {
    const index = tags.findIndex(([tK]) => tK === key);

    // Check if tag key is already on the event
    if (index !== -1) {
      // Key already present.

      // Check if new tag type can have multiple (p, e, a, etc...)
      if (multipleTag.includes(key)) {
        // Check if current value is different from existing first value
        if (value !== tags[index]?.[1]) {
          // Append new event to tags
          tags.push([key, value]);
        }
      } else {
        // Change existing
        tags[index] = [key, value];
      }
    } else {
      tags.push([key, value]);
    }
  }
  console.log("updating list", tags);
  return createEvent(ndk, {
    ...list,
    kind: list.kind as number,
    tags: tags.filter(([_, value]) => value !== undefined),
  });
}
