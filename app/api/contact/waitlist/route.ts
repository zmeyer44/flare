import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const ContactSchema = z.object({
  email: z.string(),
});

async function handler(req: Request) {
  const rawJson = await req.json();
  const data = ContactSchema.parse(rawJson);

  await prisma.waitlist.upsert({
    where: {
      email: data.email,
    },
    create: {
      email: data.email,
    },
    update: {},
  });

  return NextResponse.json({
    data: "success",
  });
}

export { handler as GET, handler as POST };
