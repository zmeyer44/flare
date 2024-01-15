"use client";
import { useState } from "react";
import { Token } from "@cashu/cashu-ts";

type TokenInfo = {
  mints: string[];
  amount: number;
  decoded: Token;
};
export default function useCashuToken() {
  const [token, setToken] = useState("");
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | undefined>();
  const [trustModal, setTrustModal] = useState(false);

  return {
    token,
    setToken,
    tokenInfo,
    setTokenInfo,
    trustModal,
    setTrustModal,
  };
}
