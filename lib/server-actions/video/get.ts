"use server";

import prisma from "@/lib/prisma";

export async function getVideo({
  identifier,
  kind,
  pubkey,
}: {
  identifier: string;
  kind: number;
  pubkey: string;
}) {
  return prisma.video.findFirstOrThrow({
    where: {
      pubkey: pubkey,
      kind: kind,
      d: identifier,
    },
  });
}
