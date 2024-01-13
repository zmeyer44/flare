"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { modal } from "@/app/_providers/modal";
import { HiChevronDown } from "react-icons/hi";
import CreateAccountForm from "./createAccount";
import LoginForm from "./login";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
export type Steps = "create-account" | "login";
type AuthModalProps = {
  step?: Steps;
};

export default function AuthModal({
  step: startingStep = "login",
}: AuthModalProps) {
  const [step, setStep] = useState<Steps>(startingStep);

  const { currentUser } = useCurrentUser();
  useEffect(() => {
    if (currentUser) {
      modal.dismiss("auth");
    }
  }, [currentUser]);

  if (step === "create-account") {
    return <CreateAccountForm setStep={setStep} />;
  }
  return <LoginForm setStep={setStep} />;
}
