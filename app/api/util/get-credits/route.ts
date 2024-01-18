import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

async function handler() {
  const credits = await prisma.storageCredit.findMany({
    where: {
      pubkey:
        "63b04d4fb51e0da1d629010d6b884d60389c2e667e88e60e7d96c050c77c5788",
    },
    select: {
      pubkey: true,
    },
  });
  await prisma.user.create({
    data: {
      pubkey:
        "63b04d4fb51e0da1d629010d6b884d60389c2e667e88e60e7d96c050c77c5788",
    },
  });

  return NextResponse.json(credits);
}

export { handler as GET, handler as POST };
