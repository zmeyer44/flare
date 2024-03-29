import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// async function handler() {

//   response.headers.set("Content-Type", "application/json");
//   response.headers.set("Access-Control-Allow-Origin", "*");
//   return response;
// }
const data = {
  names: {
    _: "0123f0970666ef69d3b6f6d5d782290dc297eedb2aa62f560f90e28168e07aaf",
    zach: "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
    "🔥": "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
  },
  nip46: {
    "0123f0970666ef69d3b6f6d5d782290dc297eedb2aa62f560f90e28168e07aaf": [
      "wss://relay.nsecbunker.com",
    ],
    "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58": [
      "wss://relay.nsecbunker.com",
    ],
  },
};
async function handler() {
  const users = await prisma.user.findMany({
    where: {
      nip05: { not: undefined },
    },
    select: {
      pubkey: true,
      nip05: true,
    },
  });
  const userNip05Map = [
    ["_", "0123f0970666ef69d3b6f6d5d782290dc297eedb2aa62f560f90e28168e07aaf"],
    ...users.map((u) => [u.nip05, u.pubkey]),
  ];
  const formattedUsers = Object.fromEntries(userNip05Map);
  const response = new NextResponse(
    JSON.stringify(
      {
        names: formattedUsers,
        nip46: {
          "0123f0970666ef69d3b6f6d5d782290dc297eedb2aa62f560f90e28168e07aaf": [
            "wss://relay.nsecbunker.com",
          ],
          "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58": [
            "wss://relay.nsecbunker.com",
          ],
        },
      },
      undefined,
      2,
    ),
    {
      status: 200,
    },
  );
  response.headers.append("Content-Type", "application/json");
  response.headers.append("Access-Control-Allow-Origin", "*");
  return response;
}

export { handler as GET, handler as POST };
