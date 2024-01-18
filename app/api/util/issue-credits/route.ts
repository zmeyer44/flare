import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

async function handler() {
  const credit = await prisma.storageCredit.create({
    data: {
      user: {
        connect: {
          pubkey:
            "b9e76546ba06456ed301d9e52bc49fa48e70a6bf2282be7a1ae72947612023dc",
        },
      },
      bytes: 2147483648,
      paymentEventId: "custom-9",
    },
  });

  return NextResponse.json({ ...credit, bytes: Number(credit.bytes) });
}

export { handler as GET, handler as POST };
