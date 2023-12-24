"use client";

import { nip19 } from "nostr-tools";
import NDK, {
  NDKNip07Signer,
  NDKNip46Signer,
  NDKPrivateKeySigner,
} from "@nostr-dev-kit/ndk";

export async function _loginWithSecret(skOrNsec: string) {
  try {
    let privkey = skOrNsec;

    if (privkey.substring(0, 4) === "nsec") {
      privkey = nip19.decode(privkey).data as string;
    }

    const signer = new NDKPrivateKeySigner(privkey);
    return signer.user().then(async (user) => {
      if (user.npub) {
        return {
          user: user,
          npub: user.npub,
          sk: privkey,
          signer: signer,
        };
      }
    });
  } catch (e) {
    throw e;
  }
}

export async function _loginWithNip46(ndk: NDK, token: string, sk?: string) {
  try {
    console.log("AT_loginWithNip46()", token);
    let localSigner = NDKPrivateKeySigner.generate();
    if (sk) {
      localSigner = new NDKPrivateKeySigner(sk);
    }

    const remoteSigner = new NDKNip46Signer(ndk, token, localSigner);
    remoteSigner.on("authUrl", (url: string) => onAuthUrl(url));

    return remoteSigner.user().then(async (user) => {
      if (user.npub) {
        await remoteSigner.blockUntilReady();
        return {
          user: user,
          npub: (await remoteSigner.user()).npub,
          sk: localSigner.privateKey,
          token: token,
          remoteSigner: remoteSigner,
          localSigner: localSigner,
        };
      }
    });
  } catch (e) {
    throw e;
  }
}
export async function _createNip46Signer(
  ndk: NDK,
  bunkerPubkey: string,
  bunkerDomain: string,
  username: string,
  email?: string,
) {
  try {
    let localSigner = NDKPrivateKeySigner.generate();

    console.log(" new NDKNip46Signer(", ndk, bunkerPubkey, localSigner);

    const signer = new NDKNip46Signer(ndk, bunkerPubkey, localSigner);
    ndk.signer = signer;
    signer.rpc.on("authUrl", (url: string) => onAuthUrl(url));
    const newSignerPubkey = await signer.createAccount(
      username,
      bunkerDomain,
      email,
    );
    if (newSignerPubkey) {
      return {
        newSignerPubkey,
        remoteSigner: signer,
      };
    }
    return;
  } catch (e) {
    throw e;
  }
}

export async function _loginWithNip07() {
  try {
    const signer = new NDKNip07Signer();
    return signer.user().then(async (user) => {
      if (user.npub) {
        return { user: user, npub: user.npub, signer: signer };
      }
    });
  } catch (e) {
    throw e;
  }
}

function onAuthUrl(url: string) {
  let popupNotOpened = true;
  let creating = true;
  let popup = window.open(url, undefined, "width=400,height=600");
  if (!popup) {
    popupNotOpened = true;
    redirectToAuthUrlWithCallback(url);
  }
  let authUrl = url;
  let checkPopup = setInterval(() => {
    if (!popup) {
      popupNotOpened = true;
    } else if (popup?.closed) {
      clearInterval(checkPopup);
      creating = false;
    }
  }, 500);
}
function redirectToAuthUrlWithCallback(url: string) {
  const redirectUrl = new URL(url);
  const callbackPath = "/auth/callback";
  const currentUrl = new URL(window.location.href);
  const callbackUrl = new URL(callbackPath, currentUrl.origin);
  redirectUrl.searchParams.set("callbackUrl", callbackUrl.toString());
  alert("sedning to " + redirectUrl.toString());
  localStorage.setItem("intended-url", window.location.href);
  // window.open(redirectUrl.toString());
  window.location.href = redirectUrl.toString();
}
