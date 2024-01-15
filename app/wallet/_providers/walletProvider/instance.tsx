"use client";
import {
  useEffect,
  PropsWithChildren,
  createContext,
  useRef,
  useContext,
  useState,
} from "react";
import {
  CashuMint,
  CashuWallet,
  deriveKeysetId,
  getDecodedToken,
  getEncodedToken,
  type GetInfoResponse,
  type MintKeys,
  type PayLnInvoiceResponse,
  type Proof,
  type RequestMintResponse,
  type Token,
} from "@cashu/cashu-ts";
import { isCashuToken, decodeLnInvoice } from "../../_utils";
import { sumProofsValue } from "./proofs";
import {
  addToken,
  deleteProofs,
  getProofsToUse,
} from "@/lib/server-actions/wallet/token";

type ClaimTokenError = {
  errorMessage: string | undefined;
  error: true;
};
type ClaimTokenSuccess = {
  error: false;
};
type ClaimTokenResponse = {
  token: Token;
  tokensWithErrors: Token | undefined;
  mint: CashuMint;
} & (ClaimTokenSuccess | ClaimTokenError);

export default function WalletInstance(mintUrls: string[]) {
  const loaded = useRef(false);
  const [mint, setMint] = useState<CashuMint | undefined>(undefined);
  const _mintKeysMap: { [mintUrl: string]: { [keySetId: string]: MintKeys } } =
    {};
  const [mintKeysMap, _setMintKeysMap] = useState<{
    [mintUrl: string]: { [keySetId: string]: MintKeys };
  }>({});
  const [wallets, _setWallets] = useState<{ [mintUrl: string]: CashuWallet }>(
    {},
  );
  //   const wallets: { [mintUrl: string]: CashuWallet } = {};
  useEffect(() => {
    console.log("Instance called");
    async function load() {
      if (mint === undefined && loaded.current === false) {
        loaded.current = true;
        await loadMint();
      }
    }
    load();
  }, []);

  async function loadMint() {
    const mintInstance = new CashuMint(
      mintUrls[0] ?? (process.env.NEXT_PUBLIC_DEFAULT_MINT_URL as string),
    );
    console.log("New mint", mintInstance);

    if (mintInstance) {
      console.log("Setting", mintInstance);
      setMint(mintInstance);
    }
  }

  function _setKeys(mintUrl: string, keys: MintKeys, keySetId?: string): void {
    if (!keySetId) {
      keySetId = deriveKeysetId(keys);
    }
    if (!_mintKeysMap[mintUrl]) {
      _mintKeysMap[mintUrl] = {};
    }
    if (!_mintKeysMap[mintUrl]?.[keySetId]) {
      _mintKeysMap[mintUrl]![keySetId] = keys;
      if (!wallets[mintUrl] || wallets[mintUrl]?.keysetId === keySetId) {
        return;
      }
      wallets[mintUrl]!.keys = keys;
    }
  }
  async function getWallet(mintUrl: string): Promise<CashuWallet> {
    if (wallets[mintUrl]) {
      return wallets[mintUrl] as CashuWallet;
    }
    const mint = new CashuMint(mintUrl);
    console.log({ mint });
    const keys = await mint.getKeys();
    const wallet = new CashuWallet(mint, keys);
    _setKeys(mintUrl, keys);
    wallets[mintUrl] = wallet;
    return wallet;
  }

  async function isTokenSpendable(token: string): Promise<boolean> {
    try {
      const decoded = getDecodedToken(token);
      if (!decoded?.token?.length) {
        return false;
      }
      const useableTokenProofs: Proof[] = [];
      for (const t of decoded.token) {
        if (!t?.proofs?.length) {
          continue;
        }

        const w = await getWallet(t.mint);
        const usedSecrets = (await w.checkProofsSpent(t.proofs)).map(
          (x) => x.secret,
        );
        if (usedSecrets.length === t.proofs.length) {
          // usedTokens.push(token)
          continue;
        }
        useableTokenProofs.push(
          ...t.proofs.filter((x) => !usedSecrets.includes(x.secret)),
        );
      }
      return !!useableTokenProofs.length;
    } catch (_) {
      return false;
    }
  }
  async function claimToken(
    encodedToken: string,
  ): Promise<false | ClaimTokenResponse> {
    if (!mint) {
      console.log("No mint");
      return false;
    }
    console.log("At Claim Token", encodedToken);
    encodedToken = isCashuToken(encodedToken) || "";
    if (!encodedToken?.trim()) {
      return false;
    }
    const decoded = getDecodedToken(encodedToken);
    console.log("decoded", decoded);
    if (!decoded?.token?.length) {
      return false;
    }
    // const trustedMints = await getMintsUrls();
    const trustedMints =
      process.env.NEXT_PUBLIC_TRUSTED_MINT_URLS?.split(",") ?? [];
    console.log(trustedMints);
    const tokenEntries = decoded.token.filter((x) =>
      trustedMints.includes(x.mint),
    );
    if (!tokenEntries?.length) {
      console.log("No trustedMints", process.env.NEXT_PUBLIC_TRUSTED_MINT_URLS);
      return false;
    }
    const mintUrls = tokenEntries.map((x) => x.mint).filter((x) => x);
    if (!mintUrls?.length) {
      console.log("No mintUrls");
      return false;
    }
    const wallet = await getWallet(mintUrls[0]!);

    const { token, tokensWithErrors, newKeys } =
      await wallet.receive(encodedToken);
    if (newKeys) {
      _setKeys(mintUrls[0]!, newKeys);
    }
    console.log(
      "[claimToken]",
      { token, tokensWithErrors },
      getEncodedToken(token),
    );
    let errorMessage: undefined | string = undefined;
    console.log("Before add token", token);
    await addToken(token);
    console.log("After");
    if (tokensWithErrors) {
      if (await isTokenSpendable(getEncodedToken(tokensWithErrors))) {
        console.log("[claimToken][tokensWithErrors]", tokensWithErrors);
        await addToken(tokensWithErrors);
      } else {
        errorMessage = "Token is not spendable";
      }
    }
    for (const mint of mintUrls) {
      // eslint-disable-next-line no-await-in-loop
      //   await addMint(mint);
    }
    if (!token?.token?.length) {
      return {
        token,
        tokensWithErrors,
        errorMessage,
        error: !!tokensWithErrors?.token.length,
        mint,
      };
    }
    return {
      token,
      tokensWithErrors,
      mint,
      error: false,
    };
  }

  async function sendToken(
    mintUrl: string,
    amount: number,
    memo: string,
    proofs: Proof[] = [],
  ): Promise<string> {
    console.log("At sendToken", mintUrl);
    const wallet = await getWallet(mintUrl);
    if (!proofs?.length) {
      const { proofsToUse } = await getProofsToUse(mintUrl, amount);
      proofs = proofsToUse;
    }
    // will throw if not enough proofs are available
    const { send, returnChange, newKeys } = await wallet.send(amount, proofs);
    if (newKeys) {
      _setKeys(mintUrl, newKeys);
    }
    // add change back to db
    if (returnChange?.length) {
      await addToken({ token: [{ mint: mintUrl, proofs: returnChange }] });
    }
    await deleteProofs(proofs);
    return getEncodedToken({
      token: [{ mint: mintUrl, proofs: send }],
      memo: memo.length > 0 ? memo : "Sent via Flare.",
    });
  }
  return {
    mint,
    claimToken,
    sendToken,
  };
}
