import { getDecodedLnInvoice, getDecodedToken } from "@cashu/cashu-ts";

import { Buffer } from "buffer/";

export function isStr(v: unknown): v is string {
  return typeof v === "string";
}
export function isNum(v: unknown): v is number {
  return typeof v === "number";
}
export function isObj(v: unknown): v is object {
  return typeof v === "object";
}
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunc(v: unknown): v is Function {
  return typeof v === "function";
}
export function isBool(v: unknown): v is boolean {
  return typeof v === "boolean";
}
export function isUndef(v: unknown): v is undefined {
  return typeof v === "undefined";
}
export function isNull(v: unknown): v is null {
  return v === null;
}
export function isArr(v: unknown): v is unknown[] {
  return Array.isArray(v);
}
export function isErr(v: unknown): v is Error {
  return v instanceof Error;
}
export function isBuf(v: unknown): v is Buffer {
  return Buffer.isBuffer(v);
}
export function isNonNullable<T>(v: T): v is NonNullable<T> {
  return !isNull(v) && !isUndef(v);
}
export function isArrOf<T>(elemGuard: (x: unknown) => x is T) {
  return (arr: unknown[]): arr is T[] => arr.every(elemGuard);
}
export function isArrOfStr(arr: unknown): arr is string[] {
  return isArr(arr) && arr.every(isStr);
}
export function isArrOfNum(arr: unknown[]): arr is number[] {
  return arr.every(isNum);
}
export function isArrOfObj(arr: unknown[]): arr is object[] {
  return arr.every(isObj);
}
export function isArrOfNonNullable<T>(arr: unknown[]): arr is NonNullable<T>[] {
  return arr.every(isNonNullable);
}

export function rndInt(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Return the unique values found in the passed iterable
 */
export function uniq<T extends string | number | bigint | boolean | symbol>(
  iter: Iterable<T>,
) {
  return [...new Set(iter)];
}

export function uniqBy<T extends object, TK extends keyof T>(
  iter: Iterable<T>,
  key: TK,
) {
  // l()
  const o = [...iter].reduce<{ [k: string | number | symbol]: T }>(
    (acc, cur) => {
      acc[cur[key] as string | number | symbol] = cur;
      return acc;
    },
    {},
  );
  // l({o})
  return Object.values<T>(o);
}

export function clearArr<T extends U[], U>(array: T) {
  array.length = 0;
}

export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function formatBalance(bal: number) {
  return (bal / 100_000_000).toFixed(8);
}

export function isToday(someDate: Date) {
  const today = new Date();
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
}

export function isUrl(url: string) {
  try {
    return !!new URL(url);
  } catch {
    /* ignore*/
  }
  return false;
}

export function formatMintUrl(url: string) {
  const clean = url.startsWith("http") ? url.split("://")[1] ?? "" : url;
  if (clean.length < 30) {
    return clean;
  }
  const u = new URL(url);
  return `${u.hostname.slice(0, 25)}...${u.pathname.slice(-10)}`;
}

/**
 * @param time a number in seconds
 * @returns the following format: 00:00
 */
export function formatSeconds(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export function isLnurl(addr: string) {
  const [user, host] = addr.split("@");
  return (
    addr.includes(".") &&
    addr.split("@").length === 2 &&
    isUrl(`https://${host}/.well-known/lnurlp/${user}`)
  );
}

export function hasTrustedMint(
  userMints: string[],
  tokenMints: string[],
): boolean;

export function hasTrustedMint(
  userMints: { mintUrl: string }[],
  tokenMints: string[],
): boolean;

export function hasTrustedMint(
  uMints: ({ mintUrl: string } | string)[],
  tMints: string[],
) {
  if (!uMints?.length || !isArr(uMints) || !tMints?.length || !isArr(tMints)) {
    return false;
  }
  return uMints.some((m) => tMints.includes(isStr(m) ? m : m.mintUrl));
}

export interface ILnUrl {
  tag: string;
  minSendable: number;
  maxSendable: number;
  callback: string;
  pr: string;
}
export async function getInvoiceFromLnurl(address: string, amount: number) {
  try {
    if (!isLnurl(address)) {
      throw new Error("invalid address");
    }
    const [user, host] = address.split("@");
    amount *= 1000;
    const resp = await fetch(`https://${host}/.well-known/lnurlp/${user}`);
    const { tag, callback, minSendable, maxSendable } =
      (await resp.json()) as ILnUrl;
    // const { tag, callback, minSendable, maxSendable } = await (await fetch(`https://${host}/.well-known/lnurlp/${user}`)).json<ILnUrl>()
    if (
      tag === "payRequest" &&
      minSendable <= amount &&
      amount <= maxSendable
    ) {
      const resp = await fetch(`${callback}?amount=${amount}`);
      const { pr } = (await resp.json()) as { pr: string };
      // const resp = await (await fetch(`${callback}?amount=${amount}`)).json<{ pr: string }>()
      if (!pr) {
        console.log("[getInvoiceFromLnurl]", { resp });
      }
      return pr || "";
    }
  } catch (err) {
    console.log("[getInvoiceFromLnurl]", err);
  }
  return "";
}

export function isCashuToken(token: string) {
  if (!token || !isStr(token)) {
    return;
  }
  token = token.trim();
  const idx = token.indexOf("cashuA");
  if (idx !== -1) {
    token = token.slice(idx);
  }
  const uriPrefixes = [
    "https://wallet.nutstash.app/#",
    "https://wallet.cashu.me/?token=",
    "web+cashu://",
    "cashu://",
    "cashu:",
  ];
  uriPrefixes.forEach((prefix) => {
    if (!token.startsWith(prefix)) {
      return;
    }
    token = token.slice(prefix.length).trim();
  });
  if (!token) {
    return;
  }
  try {
    getDecodedToken(token.trim());
  } catch (_) {
    return;
  }
  return token.trim();
}

export function isLnInvoice(str: string) {
  if (!str || !isStr(str)) {
    return;
  }
  str = str.trim();
  const uriPrefixes = [
    "lightning:",
    "lightning=",
    "lightning://",
    "lnurlp://",
    "lnurlp=",
    "lnurlp:",
    "lnurl:",
    "lnurl=",
    "lnurl://",
  ];
  uriPrefixes.forEach((prefix) => {
    if (!str.startsWith(prefix)) {
      return;
    }
    str = str.slice(prefix.length).trim();
  });
  if (!str) {
    return;
  }
  try {
    getDecodedLnInvoice(str.trim());
  } catch (_) {
    return;
  }
  return str.trim();
}

export function extractStrFromURL(url?: string) {
  try {
    const u = new URL(url || "");
    return u.hostname || u.pathname;
  } catch (e) {
    return url;
  }
}

export function* arrToChunks<T extends T[number][]>(arr: T, n: number) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}

/**
 * This function is used to show a few TX info in the history entry details page
 * @param invoice The LN invoice
 */
export function getLnInvoiceInfo(invoice: string) {
  if (!invoice) {
    return { hash: "", memo: "Mint new tokens test" };
  }
  const x = decodeLnInvoice(invoice);
  return { ...x, hash: x.paymentHash, memo: x.memo };
}

export type ValueUnion = any[] | number | string | Buffer;
export interface ISectionEntry {
  name: string;
  letters: string;
  value?: ValueUnion;
  tag?: string;
  payment_hash?: string;
}
function getFromSection<T>(
  sections: ISectionEntry[],
  name: string,
  fn: (v: unknown) => boolean,
  toNum = false,
) {
  const section = sections.find(
    (s) => s?.name === name && s?.value && fn(s.value),
  );
  return section?.value
    ? toNum
      ? (+section.value as T)
      : (section.value as T)
    : undefined;
}

export function decodeLnInvoice(invoice: string) {
  const x = getDecodedLnInvoice(invoice);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const amount = getFromSection<number>(
    x.sections,
    "amount",
    (v: unknown) => isStr(v) && isNum(+v),
    true,
  )!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const timestamp = getFromSection<number>(x.sections, "timestamp", isNum)!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const expiry = getFromSection<number>(x.sections, "expiry", isNum)!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const memo = getFromSection<string>(x.sections, "description", isStr) || "";
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const paymentHash =
    getFromSection<Buffer>(x.sections, "payment_hash", isBuf)?.toString(
      "hex",
    ) || "";
  const timePassed = Math.ceil(Date.now() / 1000) - timestamp;
  const timeLeft = expiry - timePassed;
  return {
    decoded: x,
    amount: amount / 1000,
    timestamp,
    expiry,
    timeLeft,
    memo,
    paymentHash,
  };
}

export function cleanUpNumericStr(str: string) {
  if (str.startsWith("0")) {
    return "";
  }
  return str.replace(/\D/g, "");
}

export function normalizeMintUrl(url: string) {
  const res = url.startsWith("https://") ? url : `https://${url}`;
  if (!isUrl(res)) {
    return;
  }
  return res;
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  timeout = 300,
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export function getUnixTimestampFromDaysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return Math.floor(date.getTime() / 1000);
}
