"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import useProfile from "@/lib/hooks/useProfile";
import { useNDK } from "@/app/_providers/ndk";
import { createEvent } from "@/lib/actions/create";
import { useSession } from "next-auth/react";

const profileFormSchema = z.object({
  display_name: z.string().optional(),
  name: z.string().optional(),
  about: z.string().optional(),
  website: z.string().optional(),
  nip05: z.string().optional(),
  lud16: z.string().optional(),
  // urls: z
  //   .array(
  //     z.object({
  //       value: z.string().url({ message: "Please enter a valid URL." }),
  //     }),
  //   )
  //   .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  about: "I own a computer.",
};

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useSession();
  const { currentUser, updateUser } = useCurrentUser();
  const { profile } = useProfile(currentUser?.pubkey ?? data?.user.id);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      ...profile,
      display_name: profile?.displayName,
    },
    mode: "onChange",
  });
  const { setValue, getValues } = form;
  useEffect(() => {
    if (profile) {
      if (!getValues("display_name")) {
        setValue("display_name", profile.displayName);
      }
      if (!getValues("name")) {
        setValue("name", profile.name);
      }
      if (!getValues("about")) {
        setValue("about", profile.about);
      }
      if (!getValues("website")) {
        setValue("website", profile.website);
      }
      if (!getValues("nip05")) {
        setValue("nip05", profile.nip05);
      }
      if (!getValues("lud16")) {
        setValue("lud16", profile.lud16);
      }
    }
  }, [profile]);

  // const { fields, append } = useFieldArray({
  //   name: "urls",
  //   control: form.control,
  // });
  const { ndk } = useNDK();

  async function onSubmit(data: ProfileFormValues) {
    if (!ndk || !currentUser) return;
    setIsLoading(true);
    const content = JSON.stringify({
      picture: profile?.image,
      ...profile,
      ...data,
    });
    const result = await createEvent(ndk, {
      content,
      kind: 0,
      tags: [],
    });
    if (result) {
      updateUser(JSON.stringify({ ...data, npub: currentUser.npub }));
    }
    setIsLoading(false);
    toast.success("Profile updated!");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="display_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input placeholder="John Gault" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym. You can change this whenever.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="john" {...field} />
              </FormControl>
              <FormDescription>This is your short username.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>You can include links here.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              {/* <FormDescription>This is your short username.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nip05"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nip-05</FormLabel>
              <FormControl>
                <Input placeholder="[name]@[site].[ext]" {...field} />
              </FormControl>
              <FormDescription>
                Add a Nip-05 identifier so others can find you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lud16"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bitcoin lightning address (lud16)</FormLabel>
              <FormControl>
                <Input
                  placeholder="[name]@[lightning_provider].[ext]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Add a lightning address to start getting zapped!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    Relay
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Add the relays that you use most often
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: "" })}
          >
            Add URL
          </Button>
        </div> */}
        <Button type="submit" loading={isLoading}>
          Update profile
        </Button>
      </form>
    </Form>
  );
}
