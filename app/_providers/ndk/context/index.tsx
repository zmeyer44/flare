"use client";

import { PropsWithChildren, createContext, useContext } from "react";
import NDK, {
  NDKEvent,
  NDKFilter,
  NDKNip07Signer,
  NDKNip46Signer,
  NDKPrivateKeySigner,
  NDKUser,
  NDKUserProfile,
} from "@nostr-dev-kit/ndk";
import NDKInstance from "./instance";
import {
  _loginWithNip07,
  _loginWithNip46,
  _loginWithSecret,
  _createNip46Signer,
} from "./signers";
import { Users } from "./Users";
import { log } from "@/lib/utils";

interface NDKContext {
  ndk: NDK | undefined;
  signer: NDKPrivateKeySigner | NDKNip46Signer | NDKNip07Signer | undefined;
  fetchEvents: (filter: NDKFilter) => Promise<NDKEvent[]>;
  loginWithNip46: (
    targetPubkey: string,
    sk?: string,
  ) => Promise<
    | undefined
    | {
        npub: string;
        sk: string | undefined;
        token: string;
        remoteSigner: NDKNip46Signer;
        localSigner: NDKPrivateKeySigner;
      }
  >;
  createNip46Signer: (
    npub: string,
    domain: string,
    username: string,
    email?: string,
  ) => Promise<
    | undefined
    | {
        npub: string;
        sk: string | undefined;
        token: string;
        remoteSigner: NDKNip46Signer;
        localSigner: NDKPrivateKeySigner;
      }
  >;
  loginWithSecret: (skOrNsec: string) => Promise<
    | undefined
    | {
        npub: string;
        sk: string;
        signer: NDKPrivateKeySigner;
      }
  >;
  loginWithNip07: () => Promise<
    | undefined
    | {
        npub: string;
        signer: NDKNip07Signer;
        user: NDKUser;
      }
  >;
  signPublishEvent: (
    event: NDKEvent,
    params?:
      | {
          repost: boolean;
          publish: boolean;
        }
      | undefined,
  ) => Promise<undefined | NDKEvent>;
  getUser: (_: string) => NDKUser | undefined;
  getProfile: (_: string) => NDKUserProfile | undefined;
}

const NDKContext = createContext<NDKContext>({
  ndk: undefined,
  signer: undefined,
  fetchEvents: (_: NDKFilter) => Promise.resolve([]),
  loginWithNip46: (_: string, __?: string) => Promise.resolve(undefined),
  createNip46Signer: (_: string, __: string, ___: string, ____?: string) =>
    Promise.resolve(undefined),
  loginWithSecret: (_: string) => Promise.resolve(undefined),
  loginWithNip07: () => Promise.resolve(undefined),
  signPublishEvent: (_: NDKEvent, __?: {}) => Promise.resolve(undefined),
  getUser: (_: string) => {
    return NDKUser.prototype;
  },
  getProfile: (_: string) => {
    return {};
  },
});

const NDKProvider = ({
  children,
  relayUrls,
}: PropsWithChildren<{
  relayUrls: string[];
}>) => {
  const { ndk, signer, setSigner, fetchEvents, signPublishEvent } =
    NDKInstance(relayUrls);
  const { getUser, getProfile } = Users(ndk);

  async function createNip46Signer(
    bunkerPubkey: string,
    domain: string,
    username: string,
    email?: string,
  ) {
    console.log("Called createNip46Signer", ndk, bunkerPubkey, username, email);
    if (ndk === undefined) return undefined;
    const res = await _createNip46Signer(
      ndk,
      bunkerPubkey,
      domain,
      username,
      email,
    );

    console.log("_createNip46Signer res", res);
    if (res) {
      ndk.signer = res.remoteSigner;
      await setSigner(res.remoteSigner);
      return res;
    }
  }
  async function loginWithNip46(userPubkey: string, sk?: string) {
    console.log("at loginWithNip46()", relayUrls);
    if (ndk === undefined) return undefined;
    try {
      const res = await _loginWithNip46(ndk, userPubkey, sk);
      console.log("res loginWithNip46()", res);

      if (res) {
        await setSigner(res.remoteSigner);
        return res;
      }
    } catch (err) {
      console.log("Error in loginWithNip46", err);
    }
  }

  async function loginWithSecret(skOrNsec: string) {
    const res = await _loginWithSecret(skOrNsec);
    if (res) {
      const { signer } = res;
      await setSigner(signer);
      return res;
    }
  }

  async function loginWithNip07() {
    log("func", "loginWithNip07");
    const res = await _loginWithNip07();
    if (res) {
      const { signer } = res;
      await setSigner(signer);
      return res;
    }
  }

  return (
    <NDKContext.Provider
      value={{
        ndk,
        signer,
        fetchEvents,
        loginWithNip07,
        loginWithNip46,
        createNip46Signer,
        loginWithSecret,
        signPublishEvent,
        getUser,
        getProfile,
      }}
    >
      {children}
    </NDKContext.Provider>
  );
};

const useNDK = () => {
  const context = useContext(NDKContext);
  if (context === undefined) {
    throw new Error("import NDKProvider to use useNDK");
  }
  return context;
};

export { NDKProvider, useNDK };
