import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { generateV4UploadSignedUrl } from "@/lib/server-actions/upload";
import { z } from "zod";
import { getSession } from "@/lib/auth";

const BodySchema = z.object({
  folderName: z.string().optional(),
  fileType: z.string(),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
});

// export const runtime = "edge";
async function handler(req: Request) {
  const session = await getSession();
  if (!session?.user.id) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const rawJson = await req.json();
  const body = BodySchema.parse(rawJson);
  const { folderName, fileType, fileName, fileSize } = body;
  const extension = fileName ? "." + fileName.split(".").pop() : "";
  const filename =
    `u/${session.user.id}/` +
    `${folderName ?? "uploads"}/` +
    nanoid() +
    extension;
  const signedUrl = await generateV4UploadSignedUrl(
    filename,
    fileType,
    fileSize,
  );

  return NextResponse.json({ ...signedUrl, fileName: filename });
}

export { handler as POST };
