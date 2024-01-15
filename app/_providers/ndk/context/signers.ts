"use client";

import { getPublicKey, nip19 } from "nostr-tools";
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

export async function _loginWithNip46(
  ndk: NDK,
  userPubkey: string,
  sk?: string,
) {
  try {
    console.log("AT_loginWithNip46()", userPubkey, sk);
    let localSigner = NDKPrivateKeySigner.generate();
    if (sk) {
      localSigner = new NDKPrivateKeySigner(sk);
    } else {
      localStorage.setItem("nip46-attempt-sk", localSigner.privateKey ?? "");
    }
    const remoteSigner = new NDKNip46Signer(ndk, userPubkey, localSigner);
    ndk.signer = remoteSigner;
    remoteSigner.rpc.on("authUrl", (url: string) => onAuthUrl(url));
    return remoteSigner.user().then(async (user) => {
      if (user.npub) {
        await remoteSigner.blockUntilReady();
        return {
          user: user,
          npub: (await remoteSigner.user()).npub,
          sk: localSigner.privateKey,
          token: userPubkey,
          remoteSigner: remoteSigner,
          localSigner: localSigner,
        };
      }
    });
  } catch (e) {
    console.log("throwing errro", e);
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
    localStorage.setItem("nip46-attempt-sk", localSigner.privateKey ?? "");
    const signer = new NDKNip46Signer(ndk, bunkerPubkey, localSigner);

    signer.rpc.on("authUrl", (url: string) => onAuthUrl(url));
    const newSignerPubkey = await signer.createAccount(
      username,
      bunkerDomain,
      email,
    );

    if (newSignerPubkey) {
      const remoteSigner = new NDKNip46Signer(
        ndk,
        newSignerPubkey,
        localSigner,
      );
      ndk.signer = remoteSigner;
      return {
        npub: (await remoteSigner.user()).npub,
        sk: localSigner.privateKey,
        token: newSignerPubkey,
        remoteSigner: remoteSigner,
        localSigner: localSigner,
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
  console.log("onAuthUrl", url);
  let popupNotOpened = true;
  let creating = true;
  let popup = window.open(url, "_blank", "width=400,height=600");
  console.log("popup", popup);
  if (!popup) {
    console.log("No popup", popup);
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
  console.log("redirectToAuthUrlWithCallback", url);
  const redirectUrl = new URL(url);
  const callbackPath = "/auth-callback";
  const currentUrl = new URL(window.location.href);
  const callbackUrl = new URL(callbackPath, currentUrl.origin);
  redirectUrl.searchParams.set("callbackUrl", callbackUrl.toString());
  localStorage.setItem("intended-url", window.location.href);
  // window.open(redirectUrl.toString());
  window.location.href = redirectUrl.toString();
}
