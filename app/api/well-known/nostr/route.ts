import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// async function handler() {
//   const users = await prisma.user.findMany({
//     where: {
//       nip05: { not: undefined },
//     },
//     select: {
//       pubkey: true,
//       nip05: true,
//     },
//   });
//   const userNip05Map = users.map((u) => [u.nip05, u.pubkey]);
//   const formattedUsers = Object.fromEntries(userNip05Map);
//   const response = NextResponse.json({
//     names: formattedUsers,
//   });
//   response.headers.set("Content-Type", "application/json");
//   response.headers.set("Access-Control-Allow-Origin", "*");
//   return response;
// }
const data = {
  names: {
    _: "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
    zach: "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
    "🔥": "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
  },
};
async function handler() {
  return new NextResponse(JSON.stringify(data, undefined, 2), {
    status: 200,
    headers: {
      "Cross-Origin-Resource-Policy": "cross-origin",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=30",
      "cache-control": "s-maxage=3600, stale-while-revalidate=30",
    },
  });
}

export { handler as GET, handler as POST };
