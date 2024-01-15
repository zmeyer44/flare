"use client";

import { PropsWithChildren, createContext, useContext, useState } from "react";
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
import WalletInstance from "./instance";

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

interface WalletContext {
  mint: CashuMint | undefined;
  wallets: { [mintUrl: string]: CashuWallet };
  claimToken: (encodedToken: string) => Promise<false | ClaimTokenResponse>;
  payLnInvoice: (
    mintUrl: string,
    invoice: string,
    fee: number,
    proofs?: Proof[],
  ) => Promise<
    | {
        result?: PayLnInvoiceResponse;
        fee?: number;
        realFee?: number;
        error?: unknown;
      }
    | undefined
  >;
  sendToken: (
    mintUrl: string,
    amount: number,
    memo: string,
    proofs?: Proof[],
  ) => Promise<string | null>;
}

const WalletContext = createContext<WalletContext>({
  mint: undefined,
  wallets: {},
  claimToken: (_: string) => Promise.resolve(false),
  payLnInvoice: (_: string, __: string, ___: number, ____?: Proof[]) =>
    Promise.resolve(undefined),
  sendToken: (_: string, __: number, ___?: string, ____?: Proof[]) =>
    Promise.resolve(null),
});

const WalletProvider = ({
  children,
  mintUrls,
}: PropsWithChildren<{
  mintUrls: string[];
}>) => {
  const {
    mint,
    claimToken: _claimToken,
    sendToken: _sendToken,
  } = WalletInstance(mintUrls);

  const _mintKeysMap: { [mintUrl: string]: { [keySetId: string]: MintKeys } } =
    {};
  const wallets: { [mintUrl: string]: CashuWallet } = {};
  function getMintInfo(mintUrl: string): Promise<GetInfoResponse> {
    return CashuMint.getInfo(mintUrl);
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

  async function checkProofsSpent(
    mintUrl: string,
    toCheck: { secret: string }[],
  ): Promise<{ secret: string }[]> {
    return (await getWallet(mintUrl)).checkProofsSpent(toCheck);
  }

  async function checkFees(mintUrl: string, invoice: string): Promise<number> {
    const { fee } = await CashuMint.checkFees(mintUrl, { pr: invoice });
    return fee;
  }

  async function claimToken(
    encodedToken: string,
  ): Promise<false | ClaimTokenResponse> {
    if (mint === undefined) return false;
    const res = _claimToken(encodedToken);
    return res;
  }
  async function payLnInvoice(
    mintUrl: string,
    invoice: string,
    fee: number,
    proofs: Proof[] = [],
  ): Promise<{
    result?: PayLnInvoiceResponse;
    fee?: number;
    realFee?: number;
    error?: unknown;
  }> {
    const wallet = await getWallet(mintUrl);
    const { amount } = decodeLnInvoice(invoice);
    if (!amount) {
      throw new Error("bad invoice amount");
    }
    const amountToPay = amount + fee;
    if (!proofs?.length) {
      throw new Error("No proofs provided");
      // const { proofsToUse } = await getProofsToUse(mintUrl, amountToPay);
      // proofs = proofsToUse;
    }
    if (sumProofsValue(proofs) > amountToPay) {
      console.log("[payLnInvoce] use send ", {
        amountToPay,
        amount,
        fee,
        proofs: sumProofsValue(proofs),
      });
      const { send, returnChange, newKeys } = await wallet.send(
        amountToPay,
        proofs,
      );
      if (newKeys) {
        _setKeys(mintUrl, newKeys);
      }
      if (returnChange?.length) {
        // await addToken({ token: [{ mint: mintUrl, proofs: returnChange }] });
      }
      if (send?.length) {
        // await deleteProofs(proofs);
      }
      proofs = send;
    }
    try {
      console.log({ fee, sum: sumProofsValue(proofs) });
      const result = await wallet.payLnInvoice(invoice, proofs, fee);
      if (result?.newKeys) {
        _setKeys(mintUrl, result.newKeys);
      }
      if (result?.change?.length) {
        // await addToken({ token: [{ mint: mintUrl, proofs: result.change }] });
      }
      if (result.isPaid) {
        // await deleteProofs(proofs);
      }
      const realFee = fee - sumProofsValue(result.change);
      if (realFee < 0) {
        console.log(
          "######################################## ERROR ####################################",
        );
        console.log({
          result,
          fee,
          realFee,
          amountToPay,
          amount,
          proofs: sumProofsValue(proofs),
        });
      }
      return { result, fee, realFee };
    } catch (error) {
      // await addToken({ token: [{ mint: mintUrl, proofs }] });
      return { result: undefined, error };
    }
  }

  async function sendToken(
    mintUrl: string,
    amount: number,
    memo: string,
    proofs: Proof[] = [],
  ): Promise<string> {
    console.log("At sendToken", mintUrl);
    if (mint === undefined) {
      throw new Error("Mint error");
    }
    const res = _sendToken(mintUrl, amount, memo, proofs);
    return res;
  }
  async function requestMint(
    mintUrl: string,
    amount: number,
  ): Promise<RequestMintResponse> {
    const wallet = await getWallet(mintUrl);
    const result = await wallet.requestMint(amount);
    // await addInvoice({ amount, mintUrl, ...result });
    // runRequestTokenLoop();
    console.log("[requestMint]", { result, mintUrl, amount });
    return result;
  }
  async function requestToken(
    mintUrl: string,
    amount: number,
    hash: string,
  ): Promise<{ success: boolean; invoice: string | null | undefined }> {
    // const invoice = await getInvoice(hash);
    const wallet = await getWallet(mintUrl);
    const { proofs, newKeys } = await wallet.requestTokens(amount, hash);
    console.log("[requestToken]", { proofs, mintUrl, amount, hash });
    if (newKeys) {
      _setKeys(mintUrl, newKeys);
    }
    // await addToken({ token: [{ mint: mintUrl, proofs }] });
    // await delInvoice(hash);
    return { success: true, invoice: "" };
  }

  return (
    <WalletContext.Provider
      value={{
        mint,
        wallets,
        claimToken,
        payLnInvoice,
        sendToken,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("import WalletProvider to use useWallet");
  }
  return context;
};

export { WalletProvider, useWallet };
