import { NextRequest, NextResponse } from "next/server";
import NDK, {
  NDKPrivateKeySigner,
  NDKEvent,
  NDKUser,
} from "@nostr-dev-kit/ndk";
import { RELAYS } from "@/constants";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";
async function handler(req: NextRequest) {
  const signer = NDKPrivateKeySigner.generate();
  const ndkInstance = new NDK({
    explicitRelayUrls: RELAYS,
    signer,
  });
  await ndkInstance.connect();
  ndkInstance.signer = signer;

  const event = new NDKEvent(ndkInstance, {
    content: "TEST MESSAGE",
    pubkey: (await signer.user()).pubkey,
    tags: [
      ["p", "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58"],
    ],
    created_at: unixTimeNowInSeconds(),
  });
  await event.encrypt(
    new NDKUser({
      pubkey:
        "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
    }),
  );
  await event.sign();
  await event.publish();

  return NextResponse.json({
    message: "success",
  });
}

export { handler as GET, handler as POST };
