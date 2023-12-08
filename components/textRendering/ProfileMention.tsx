"use client";

import Link from "next/link";
import { nip19 } from "nostr-tools";
import { NOSTR_BECH32_REGEXP } from "@/lib/nostr/utils";
import { useNDK } from "@/app/_providers/ndk";
import useProfile from "@/lib/hooks/useProfile";

type ProfileMentionProps = {
  mention: string;
};

function getPubkey(mention: string) {
  try {
    return NOSTR_BECH32_REGEXP.test(mention)
      ? nip19.decode(mention).data.toString()
      : mention;
  } catch (err) {
    console.log("Error getting pubkey", err);
    return "";
  }
}

export default function ProfileMention({ mention }: ProfileMentionProps) {
  const pubkey = getPubkey(mention);
  const { profile } = useProfile(pubkey);

  return (
    <Link href={`/${mention}`}>
      <span className="text-primary hover:underline">{`@${
        profile?.name ?? profile?.displayName ?? mention
      }`}</span>
    </Link>
  );
}
