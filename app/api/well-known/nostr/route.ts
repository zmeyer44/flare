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
async function handler() {
  const response = NextResponse.json({
    names: {
      _: "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
      zach: "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
    },
  });
  response.headers.set("Content-Type", "application/json");
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export { handler as GET, handler as POST };
