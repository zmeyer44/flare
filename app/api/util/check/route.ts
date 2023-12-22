import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// import fetch from "node-fetch";
async function handler() {
  const upload = await prisma.upload.findMany();
  //   const storageCredit = await prisma.storageCredit.findMany();
  const video = await prisma.video.findMany();

  const response = NextResponse.json({
    upload,
    video,
  });

  return response;
}

export { handler as GET, handler as POST };
