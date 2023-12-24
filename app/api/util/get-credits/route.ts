import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

async function handler() {
  const credits = await prisma.storageCredit.findMany({
    select: {
      pubkey: true,
    },
  });

  return NextResponse.json(credits);
}

export { handler as GET, handler as POST };
