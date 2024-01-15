"use server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getUserFromNip05(name: string) {
  return prisma.user.findFirstOrThrow({
    where: {
      nip05: name,
    },
  });
}

export async function getCurrentUser() {
  const session = await getSession();
  if (session?.user.id) {
    return prisma.user.findFirst({
      where: { pubkey: session.user.id },
    });
  }
  return null;
}
export async function getCurrentUserWithMints() {
  const session = await getSession();
  if (session?.user.id) {
    console.log("Fetching", session?.user.id);
    return prisma.user.findFirst({
      where: { pubkey: session.user.id },
      include: {
        mints: true,
      },
    });
  }
  return null;
}

export type CurrentUserType = Exclude<
  Awaited<ReturnType<typeof getCurrentUser>>,
  null
>;
export type CurrentUserWithMintType = Exclude<
  Awaited<ReturnType<typeof getCurrentUserWithMints>>,
  null
>;
