"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import {
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  DrawerBody,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { modal } from "@/app/_providers/modal";
import ProviderSelectModal from "./providerSelect";
import { HiChevronDown } from "react-icons/hi";
import { Steps } from ".";
import { useNDK } from "@/app/_providers/ndk";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { toast } from "sonner";

const PROVIDERS = [
  {
    domain: "nostr.me",
    label: "Nostr.me",
    pubkey: "9c1636cda4be9bce36fe06f99f71c21525b109e0f6f206eb7a5f72093ec89f02",
  },
  {
    domain: "flare.pub",
    label: "Flare.pub",
    pubkey: "7c1636cda4be9bce36fe06f99f71c21525b109e0f6f206eb7a5f72093ec89f02",
  },
  {
    domain: "getfaaans.com",
    label: "GetFaans.com",
    pubkey: "8c1636cda4be9bce36fe06f99f71c21525b109e0f6f206eb7a5f72093ec89f02",
  },
] as const;

const createAccountFormSchema = z.object({
  username: z
    .string()
    .min(3, "Must be at least 3 characters")
    .max(16, "Username too long"),
  provider: z.object({
    pubkey: z.string(),
    domain: z.string(),
  }),
  email: z.string().email("Must be a valid email").optional(),
});

type CreateAccountFormValues = z.infer<typeof createAccountFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<CreateAccountFormValues> = {
  provider: PROVIDERS[0],
};

type CreateAccountFormProps = {
  setStep: React.Dispatch<React.SetStateAction<Steps>>;
};
export default function CreateAccountForm({ setStep }: CreateAccountFormProps) {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const { ndk, createNip46Signer, fetchEvents } = useNDK();
  const { loginWithPubkey } = useCurrentUser();

  const form = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountFormSchema),
    defaultValues: {
      ...defaultValues,
    },
    mode: "onChange",
    delayError: 2000,
  });
  const { setValue, watch } = form;
  async function onSubmit(data: CreateAccountFormValues) {
    setIsCreatingAccount(true);
    try {
      const nip46Signer = await createNip46Signer(
        data.provider.pubkey,
        data.provider.domain,
        data.username,
        data.email,
      );
      if (nip46Signer) {
        await loginWithPubkey(nip46Signer.newSignerPubkey);
        toast.success("Account created!");
      }
    } catch (err) {
      toast.error("An error occured while creating account");
      console.log("Error creating account", err);
    } finally {
      setIsCreatingAccount(false);
    }
  }

  const activeProvider = watch("provider");

  //   useEffect(() => {
  //     if (!ndk) return;
  //     fetchProviders();
  //   }, [ndk]);

  //   async function fetchProviders() {
  //     console.log("fetchProviders() called");
  //     const providers = await fetchEvents({
  //       //   kinds: [31989],
  //       authors: [
  //         "9c1636cda4be9bce36fe06f99f71c21525b109e0f6f206eb7a5f72093ec89f02",
  //       ],
  //       //   ["#d"]: [],
  //     });
  //     console.log("Pablos", providers);
  //   }

  return (
    <div className="">
      <DrawerHeader>
        <DrawerTitle className="text-xl">Welcome to Flare</DrawerTitle>
        <DrawerDescription>Create an account</DrawerDescription>
      </DrawerHeader>
      <DrawerBody>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 text-left"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-within:outline-none focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                      <input
                        placeholder="henry"
                        className="invisible-input text-[16px] sm:text-sm"
                        {...field}
                      />
                      <span
                        onClick={() => {
                          modal.show(
                            <ProviderSelectModal
                              providers={[...PROVIDERS]}
                              activeProvider={activeProvider}
                              onChange={(p) => {
                                const selectedProvider = PROVIDERS.find(
                                  (p) => p.pubkey === activeProvider.pubkey,
                                );
                                if (selectedProvider) {
                                  setValue("provider", selectedProvider);
                                }
                              }}
                            />,
                            {
                              id: "provider-select",
                            },
                          );
                        }}
                        className="flex cursor-pointer items-center gap-x-1 pl-3 text-muted-foreground hover:text-foreground"
                      >
                        {`@${
                          PROVIDERS.find(
                            (p) => p.pubkey === activeProvider.pubkey,
                          )?.label ?? ""
                        }`}
                        <HiChevronDown className="h-5 w-5 shrink-0" />
                      </span>
                    </div>
                  </FormControl>
                  <FormDescription>
                    This is the username you will use to login to Flare and
                    other Nostr apps
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email{"  "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormDescription>
                    We only use this to recover your account if you lose your
                    password
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button loading={isCreatingAccount} type="submit">
              Create Account
            </Button>
          </form>
        </Form>
      </DrawerBody>
      <DrawerFooter>
        <Button onClick={() => setStep("login")} variant="ghost">
          Already on Nostr?
        </Button>
      </DrawerFooter>
    </div>
  );
}
