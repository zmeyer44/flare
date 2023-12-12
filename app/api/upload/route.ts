import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { generateV4UploadSignedUrl } from "@/lib/server-actions/upload";
import { z } from "zod";

const BodySchema = z.object({
  folderName: z.string().optional(),
  fileType: z.string(),
  fileName: z.string().optional(),
});

// export const runtime = "edge";
async function handler(req: Request) {
  // const session = await getSession();
  // if (!session?.user.id) {
  //   return new Response("Unauthorized", {
  //     status: 401,
  //   });
  // }
  const rawJson = await req.json();
  const body = BodySchema.parse(rawJson);
  const { folderName, fileType, fileName } = body;
  const extension = fileName ? "." + fileName.split(".").pop() : "";
  const filename = (`${folderName}/` ?? "") + nanoid() + extension;
  const signedUrl = await generateV4UploadSignedUrl(filename, fileType);

  return NextResponse.json({ ...signedUrl, fileName: filename });
}

export { handler as POST };
