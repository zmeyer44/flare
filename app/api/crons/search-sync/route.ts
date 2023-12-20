import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { updateVideo } from "@/lib/server-actions/search/algolia";

async function handler() {
  const FiveMinsAgo = new Date(Date.now() - 1000 * 60 * 6);
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
            gt: FiveMinsAgo,
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
