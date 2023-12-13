"use server";

import prisma from "@/lib/prisma";

export async function getUserFromNip05(name: string) {
  return prisma.user.findFirstOrThrow({
    where: {
      nip05: name,
    },
  });
}
