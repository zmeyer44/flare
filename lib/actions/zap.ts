import NDK, {
  NDKEvent,
  NDKUser,
  NDKSigner,
  zapInvoiceFromEvent,
  type NostrEvent,
} from "@nostr-dev-kit/ndk";
import { requestProvider } from "webln";
import { bech32 } from "@scure/base";
import { z } from "zod";
import { createZodFetcher } from "zod-fetch";
import { getTagValues, getTagsAllValues } from "../nostr/utils";
import { unixTimeNowInSeconds } from "../nostr/dates";
import { createEvent } from "./create";
import { log } from "@/lib/utils";

const fetchWithZod = createZodFetcher();
const ZapEndpointResponseSchema = z.object({
  nostrPubkey: z.string(),
});

export async function zapUser(
  ndk: NDK,
  amount: number,
  pubkey: string,
  comment?: string,
) {
  log("func", "zapUser");
  console.log("called zapUser", pubkey);
  const user = await ndk.getUser({
    pubkey,
  });
  // const user = await new NDKUser({ pubkey });
  log("info", JSON.stringify(user));
  const pr = await user.zap(amount * 1000, comment);
  if (!pr) {
    log("info", "No PR");
    return;
  }
  const webln = await requestProvider();
  return await webln.sendPayment(pr);
}
export async function checkUserZap(
  ndk: NDK,
  sender: string,
  recipient: string,
  amountCheck: number,
  createdAt?: number,
) {
  const paymentEvents = await ndk.fetchEvents({
    kinds: [9735],
    ["#p"]: [recipient],
    since: createdAt,
  });
  if (!paymentEvents) return;
  const paymentEvent = Array.from(paymentEvents).find(
    (e) => zapInvoiceFromEvent(e)?.zappee === sender,
  );
  if (!paymentEvent) return;
  const invoice = zapInvoiceFromEvent(paymentEvent);
  if (!invoice) {
    console.log("No invoice");
    return;
  }
  const zappedUser = ndk.getUser({
    pubkey: invoice.zapped,
  });
  await zappedUser.fetchProfile();
  if (!zappedUser.profile) {
    console.log("No zappedUser profile");
    return;
  }
  const { lud16, lud06 } = zappedUser.profile;
  let zapEndpoint: null | string = null;

  if (lud16 && !lud16.startsWith("LNURL")) {
    const [name, domain] = lud16.split("@");
    zapEndpoint = `https://${domain}/.well-known/lnurlp/${name}`;
  } else if (lud06) {
    const { words } = bech32.decode(lud06, 1e3);
    const data = bech32.fromWords(words);
    const utf8Decoder = new TextDecoder("utf-8");
    zapEndpoint = utf8Decoder.decode(data);
  }
  if (!zapEndpoint) {
    console.log("No zapEndpoint");
    return;
  }

  const { nostrPubkey } = await fetchWithZod(
    // The schema you want to validate with
    ZapEndpointResponseSchema,
    // Any parameters you would usually pass to fetch
    zapEndpoint,
    {
      method: "GET",
    },
  );
  if (!nostrPubkey) return;
  console.log("nostrPubkey", nostrPubkey);
  console.log("Invoice amount", invoice.amount);
  if (nostrPubkey === paymentEvent.pubkey && invoice.amount >= amountCheck) {
    return {
      paymentEvent: paymentEvent.rawEvent(),
      zapEndpoint: zapEndpoint,
    };
  }
  return;
}
export async function zapEvent(
  ndk: NDK,
  amount: number,
  _event: NostrEvent,
  comment?: string,
) {
  log("func", "zapUser");
  const event = await new NDKEvent(ndk, _event);
  log("info", JSON.stringify(event));
  const pr = await event.zap(amount * 1000, comment);
  if (!pr) {
    log("info", "No PR");
    return;
  }
  const webln = await requestProvider();
  return await webln.sendPayment(pr);
}
export async function checkEventZap(
  ndk: NDK,
  sender: string,
  eventTagId: string,
  amountCheck: number,
) {
  const paymentEvents = await ndk.fetchEvents({
    kinds: [9735],
    ["#a"]: [eventTagId],
  });
  if (!paymentEvents) return;
  const paymentEvent = Array.from(paymentEvents).find(
    (e) => zapInvoiceFromEvent(e)?.zappee === sender,
  );
  if (!paymentEvent) return;
  const invoice = zapInvoiceFromEvent(paymentEvent);
  if (!invoice) {
    console.log("No invoice");
    return;
  }
  const zappedUser = ndk.getUser({
    pubkey: invoice.zapped,
  });
  await zappedUser.fetchProfile();
  if (!zappedUser.profile) {
    console.log("No zappedUser profile");
    return;
  }
  const { lud16, lud06 } = zappedUser.profile;
  let zapEndpoint: null | string = null;

  if (lud16 && !lud16.startsWith("LNURL")) {
    const [name, domain] = lud16.split("@");
    zapEndpoint = `https://${domain}/.well-known/lnurlp/${name}`;
  } else if (lud06) {
    const { words } = bech32.decode(lud06, 1e3);
    const data = bech32.fromWords(words);
    const utf8Decoder = new TextDecoder("utf-8");
    zapEndpoint = utf8Decoder.decode(data);
  }
  if (!zapEndpoint) {
    console.log("No zapEndpoint");
    return;
  }

  const { nostrPubkey } = await fetchWithZod(
    // The schema you want to validate with
    ZapEndpointResponseSchema,
    // Any parameters you would usually pass to fetch
    zapEndpoint,
    {
      method: "GET",
    },
  );
  if (!nostrPubkey) return;
  console.log("nostrPubkey", nostrPubkey);
  console.log("Invoice amount", invoice.amount);
  return nostrPubkey === paymentEvent.pubkey && invoice.amount >= amountCheck;
}
export async function sendZap(
  ndk: NDK,
  amount: number,
  _event: NostrEvent,
  comment?: string,
) {
  log("func", "sendZap");
  const event = await new NDKEvent(ndk, _event);
  const pr = await event.zap(amount * 1000, comment);

  if (!pr) {
    log("info", "No PR");
    return;
  }
  const webln = await requestProvider();
  return await webln.sendPayment(pr);
}

export async function checkPayment(
  ndk: NDK,
  tagId: string,
  pubkey: string,
  event: NostrEvent,
) {
  const paymentEvents = await ndk.fetchEvents({
    kinds: [9735],
    ["#a"]: [tagId],
  });
  if (!paymentEvents) return;
  const paymentEvent = Array.from(paymentEvents).find(
    (e) => zapInvoiceFromEvent(e)?.zappee === pubkey,
  );
  if (!paymentEvent) return;
  const invoice = zapInvoiceFromEvent(paymentEvent);
  if (!invoice) {
    console.log("No invoice");
    return;
  }

  const zappedUser = ndk.getUser({
    hexpubkey: invoice.zapped,
  });
  await zappedUser.fetchProfile();
  if (!zappedUser.profile) {
    console.log("No zappedUser profile");
    return;
  }
  const { lud16, lud06 } = zappedUser.profile;
  let zapEndpoint: null | string = null;

  if (lud16 && !lud16.startsWith("LNURL")) {
    const [name, domain] = lud16.split("@");
    zapEndpoint = `https://${domain}/.well-known/lnurlp/${name}`;
  } else if (lud06) {
    const { words } = bech32.decode(lud06, 1e3);
    const data = bech32.fromWords(words);
    const utf8Decoder = new TextDecoder("utf-8");
    zapEndpoint = utf8Decoder.decode(data);
  }
  if (!zapEndpoint) {
    console.log("No zapEndpoint");
    return;
  }

  const { nostrPubkey } = await fetchWithZod(
    // The schema you want to validate with
    ZapEndpointResponseSchema,
    // Any parameters you would usually pass to fetch
    zapEndpoint,
    {
      method: "GET",
    },
  );
  if (!nostrPubkey) return;
  console.log("nostrPubkey", nostrPubkey);
  console.log("Invoice amount", invoice.amount);
  console.log("Price", parseInt(getTagValues("price", event.tags) ?? "0"));
  return (
    nostrPubkey === paymentEvent.pubkey &&
    invoice.amount >= parseInt(getTagValues("price", event.tags) ?? "0")
  );
}
