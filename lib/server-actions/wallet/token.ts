"use server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Token, Proof } from "@cashu/cashu-ts";

export async function addToken(token: Token) {
  const session = await getSession();
  if (!session?.user.id) {
    throw new Error("Must be logged in");
  }
  const flatProofs = token.token
    .flatMap((t) => t.proofs)
    .map((p) => ({ ...p, userPubkey: session.user.id }));
  const proofs = await prisma.proof.createMany({
    data: flatProofs,
  });
  return proofs;
}

export async function deleteProofs(proofs: Proof[]) {
  const session = await getSession();
  if (!session?.user.id) {
    throw new Error("Must be logged in");
  }
  for (const proof of proofs) {
    await prisma.proof.delete({
      where: {
        secret: proof.secret,
        userPubkey: session.user.id,
      },
    });
  }
  return;
}

export async function getProofsToUse(
  mintUrl: string,
  amount: number,
  order: "asc" | "desc" = "desc",
) {
  const session = await getSession();
  if (!session?.user.id) {
    throw new Error("Must be logged in");
  }
  const mintsIds = await prisma.mint.findMany({
    where: {
      url: mintUrl,
    },
    select: {
      id: true,
    },
  });

  const usableProofs = await prisma.proof.findMany({
    where: {
      id: {
        in: mintsIds.map((m) => m.id),
      },
      userPubkey: session.user.id,
    },
  });
  const proofsToSend: Proof[] = [];
  let amountAvailable = 0;
  if (order === "desc") {
    usableProofs.sort((a, b) => b.amount - a.amount);
  } else {
    usableProofs.sort((a, b) => a.amount - b.amount);
  }
  usableProofs.forEach((proof) => {
    if (amountAvailable >= amount) {
      return;
    }
    amountAvailable = amountAvailable + proof.amount;
    proofsToSend.push(proof);
  });
  return { proofsToUse: proofsToSend };
}
