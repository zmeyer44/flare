import { NextRequest, NextResponse } from "next/server";
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

async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const token = searchParams.get("token");
  if (token !== process.env.WAITLIST_TOKEN) {
    return NextResponse.json({
      data: "Invalid token",
    });
  }
  const data = await prisma.waitlist.findMany({
    select: {
      email: true,
    },
  });

  const response = new NextResponse(JSON.stringify(data, undefined, 2), {
    status: 200,
  });
  return response;
}

export { GET, POST };
// export { handler as GET, handler as POST };
