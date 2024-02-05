import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const ContactSchema = z.object({
  email: z.string(),
});

async function POST(req: Request) {
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

async function GET(req: Request) {
  const data = await prisma.waitlist.findMany({
    select: {
      email: true,
    },
  });

  return NextResponse.json(data);
}

export { GET, POST };
// export { handler as GET, handler as POST };
