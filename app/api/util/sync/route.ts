import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { EventSchema } from "@/types";
// import fetch from "node-fetch";
async function handler() {
  const res = await fetch("http://localhost:8080/sync").then((r) => r.json());
  const upload = res.upload;
  const storageCredit = res.storageCredit;
  const video = res.video;
  // return NextResponse.json(storageCredit.map((s) => s.paymentEvent));

  // const createdUsers = await prisma.user.createMany({
  //   data: user,
  // });
  // const createdStorageCredit = await prisma.storageCredit.createMany({
  //   data: storageCredit.map((s) => ({
  //     ...s,
  //     paymentEvent: s.paymentEvent,
  //   })),
  // });
  // const createdUploads = await prisma.upload.createMany({
  //   data: upload,
  // });
  for (const vid of video) {
    const exists = await prisma.video.findFirst({
      where: {
        pubkey: vid.pubkey,
        d: vid.d,
      },
    });
    if (!exists) {
      await prisma.video.create({
        data: vid,
      });
    }
  }

  const response = NextResponse.json({
    ok: true,
  });

  return response;
}

export { handler as GET, handler as POST };
