import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const AlertSchema = z.object({
  amount: z.number(),
  boostagram: z.string().nullable(),
  comment: z.string().nullable(),
  created_at: z.string(),
  creation_date: z.number(),
  currency: z.string(),
  description_hash: z.string(),
  destination_alias: z.string(),
  destination_pubkey: z.string(),
  expires_at: z.string(),
  expiry: z.number(),
  fiat_currency: z.string(),
  fiat_in_cents: z.number(),
  first_route_hint_alias: z.string().nullable(),
  first_route_hint_pubkey: z.string().nullable(),
  identifier: z.string(),
  keysend_message: z.string().nullable(),
  memo: z.string().nullable(),
  metadata: z
    .object({
      zap_request: z.object({
        content: z.string(),
        created_at: z.number(),
        id: z.string(),
        kind: z.number(),
        pubkey: z.string(),
        sig: z.string(),
        tags: z.array(z.array(z.string())),
      }),
      zap_request_raw: z.string(),
    })
    .nullable(),
  payer_email: z.string().nullable(),
  payer_name: z.string().nullable(),
  payer_pubkey: z.string().nullable(),
  payment_hash: z.string(),
  payment_request: z.string(),
  preimage: z.string(),
  r_hash_str: z.string(),
  settled: z.boolean(),
  settled_at: z.string(),
  state: z.string(),
  type: z.string(),
  value: z.number(),
});

async function handler(req: Request) {
  const rawJson = await req.json();
  console.log("raw json, ", rawJson);
  const data = AlertSchema.parse(rawJson);
  if (!data.payer_pubkey) {
    return NextResponse.json({
      data: "no pubkey",
    });
  } else if (!data.settled) {
    return NextResponse.json({
      data: "Not settled",
    });
  } else if (data.amount !== 10000) {
    return NextResponse.json({
      data: "Incorrect amount",
    });
  } else if (!data.comment?.startsWith("Purchasing 2 Gb")) {
    return NextResponse.json({
      data: "Not purchasing",
    });
  } else if (!data.metadata) {
    return NextResponse.json({
      data: "No metadata",
    });
  }
  const checkCredit = await prisma.storageCredit.findFirst({
    where: {
      paymentHash: data.payment_hash,
    },
  });
  if (checkCredit) {
    return NextResponse.json({
      data: "Already processed",
    });
  }

  await prisma.user.upsert({
    where: {
      pubkey: data.payer_pubkey,
    },
    create: {
      pubkey: data.payer_pubkey,
    },
    update: {},
  });

  await prisma.storageCredit.create({
    data: {
      paymentHash: data.payment_hash,
      pubkey: data.payer_pubkey,
      bytes: 2_147_483_648,
      paymentEventId: data.metadata.zap_request.id,
    },
  });

  //   const message = MessageSchema.parse(JSON.parse(data.Message));
  //   for (const record of message.Records) {
  //     const recordSize = record.s3.object.size;
  //     const key = record.s3.object.key;
  //     if (!key.startsWith("u/")) continue;

  //     const pubkey = key.split("/")[1] as string;
  //     const upload = await prisma.upload.create({
  //       data: {
  //         url: `${process.env.S3_BUCKET_URL}/${key}`,
  //         pubkey: pubkey,
  //         size: recordSize,
  //       },
  //     });
  //   }

  return NextResponse.json({
    data: "Created Storage Credit",
  });
}

export { handler as GET, handler as POST };
