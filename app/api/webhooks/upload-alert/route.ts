import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

async function handler() {
  const response = NextResponse.json({
    data: "hello",
  });
  response.headers.set("Content-Type", "application/json");
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export { handler as GET, handler as POST };
