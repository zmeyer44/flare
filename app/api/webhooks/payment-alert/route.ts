import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const AlertSchema = z.object({
  Type: z.string(),
  MessageId: z.string(),
  TopicArn: z.string(),
  Subject: z.string(),
  Message: z.string(),
  Timestamp: z.string(),
  SignatureVersion: z.string(),
  Signature: z.string(),
  SigningCertURL: z.string(),
  UnsubscribeURL: z.string(),
});

const RecordSchema = z.object({
  eventVersion: z.string(),
  eventSource: z.string(),
  awsRegion: z.string(),
  eventTime: z.string(),
  eventName: z.string(),
  userIdentity: z.object({ principalId: z.string() }),
  requestParameters: z.object({ sourceIPAddress: z.string() }),
  responseElements: z.object({
    "x-amz-request-id": z.string(),
    "x-amz-id-2": z.string(),
  }),
  s3: z.object({
    s3SchemaVersion: z.string(),
    configurationId: z.string(),
    bucket: z.object({
      name: z.string(),
      ownerIdentity: z.object({ principalId: z.string() }),
      arn: z.string(),
    }),
    object: z.object({
      key: z.string(),
      size: z.number(),
      eTag: z.string(),
      sequencer: z.string(),
    }),
  }),
});

const MessageSchema = z.object({
  Records: z.array(RecordSchema),
});

async function handler(req: Request) {
  const rawJson = await req.json();
  console.log("raw json, ", rawJson);
  //   const data = AlertSchema.parse(rawJson);
  //   if (data.Type !== "Notification") {
  //     return NextResponse.json({
  //       data: "ok",
  //     });
  //   }
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
  });
}

export { handler as GET, handler as POST };
