import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const AlertSchema = z.object({
  amount: z.number(),
  comment: z.string(),
  created_at: z.string(),
  creation_date: z.number(),
  currency: z.string(),
  custom_records: z.object({}).nullable(),
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
  keysend_message: z.null(),
  memo: z.string().nullable(),
  metadata: z.object({}),
  payer_email: z.string().nullable(),
  payer_name: z.string().nullable(),
  payer_pubkey: z.string().nullable(),
  payment_hash: z.string(),
  payment_request: z.string(),
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
  }
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
    data: rawJson,
    parsed: data,
  });
}

export { handler as GET, handler as POST };
