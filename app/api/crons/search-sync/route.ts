import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { updateVideo } from "@/lib/server-actions/search/algolia";

async function handler() {
  const Year = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365);
  const FiveMinsAgo = new Date(Date.now() - 1000 * 60 * 5);
  const recentUploads = await prisma.video.findMany({
    where: {
      OR: [
        {
          updatedAt: {
            gt: FiveMinsAgo,
          },
        },
        {
          createdAt: {
            gt: Year,
          },
        },
      ],
    },
  });
  for (const upload of recentUploads) {
    await updateVideo(upload);
  }
  const response = NextResponse.json({
    added: recentUploads.length,
  });
  return response;
}

export { handler as GET, handler as POST };
