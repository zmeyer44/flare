import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

import { unixTimeNowInSeconds } from "@/lib/nostr/dates";
import { uniq } from "ramda";
import { CashuMint, deriveKeysetId, Proof } from "@cashu/cashu-ts";

export const walletRouter = createTRPCRouter({
  hasMints: protectedProcedure.query(async ({ ctx, input }) => {
    const mint = await ctx.prisma.userMint.findFirst({
      where: {
        userPubkey: ctx.session.user.pubkey,
      },
    });
    return mint;
  }),
  getBalance: protectedProcedure
    .input(z.object({ used: z.boolean().optional() }))
    .query(async ({ ctx, input }) => {
      console.log(ctx.session);
      const balance = await ctx.prisma.proof.aggregate({
        where: {
          used: input.used,
          userPubkey: ctx.session.user.pubkey,
        },
        _sum: {
          amount: true,
        },
      });
      return balance._sum.amount ?? 0;
    }),
  getTransactions: protectedProcedure.query(async ({ ctx, input }) => {
    console.log(ctx.session);
    const proofIds = await ctx.prisma.proof.groupBy({
      by: ["id"],
      where: {
        userPubkey: ctx.session.user.pubkey,
      },
      _sum: {
        amount: true,
      },
    });

    return proofIds.flatMap((p) => ({ id: p.id, amount: p._sum.amount }));
  }),
  addMint: protectedProcedure
    .input(
      z.object({
        mintUrl: z.string(),
        customName: z.string().optional(),
        default: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("At Create mint");
      return ctx.prisma.userMint.create({
        data: {
          mintUrl: input.mintUrl,
          userPubkey: ctx.session.user.pubkey,
          customName: input.customName,
          default: input.default,
        },
      });
    }),
  addToken: protectedProcedure
    .input(
      z.object({
        token: z.object({
          token: z
            .object({
              mint: z.string(),
              proofs: z
                .object({
                  C: z.string(),
                  amount: z.number().min(0),
                  id: z.string(),
                  secret: z.string(),
                })
                .array(),
            })
            .array(),
          memo: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input: { token } }) => {
      console.log("At add token");
      const flatProofs = token.token
        .flatMap((t) => t.proofs)
        .map((p) => ({ ...p, userPubkey: ctx.session.user.pubkey }));
      const proofs = await ctx.prisma.proof.createMany({
        data: flatProofs,
      });
      return proofs;
    }),
  getProofsToUse: protectedProcedure
    .input(
      z.object({
        mintUrl: z.string(),
        amount: z.number().min(0),
      }),
    )
    .mutation(async ({ ctx, input: { mintUrl, amount } }) => {
      console.log("getProofsToUse");
      const mintsIds = await ctx.prisma.mint.findMany({
        where: {
          url: mintUrl,
        },
        select: {
          id: true,
        },
      });
      let order = "desc";
      const usableProofs = await ctx.prisma.proof.findMany({
        where: {
          id: {
            in: mintsIds.map((m) => m.id),
          },
          userPubkey: ctx.session.user.pubkey,
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
      return proofsToSend;
    }),
  deleteProofs: protectedProcedure
    .input(
      z.object({
        proofs: z
          .object({
            C: z.string(),
            amount: z.number().min(0),
            id: z.string(),
            secret: z.string(),
          })
          .array(),
      }),
    )
    .mutation(async ({ ctx, input: { proofs } }) => {
      console.log("Deleting proofs");
      for (const proof of proofs) {
        await ctx.prisma.proof.delete({
          where: {
            secret: proof.secret,
            userPubkey: ctx.session.user.pubkey,
          },
        });
      }
    }),
});

async function getCurrentKeySetId(mintUrl: string) {
  const keys = await CashuMint.getKeys(mintUrl);
  const keySetId = deriveKeysetId(keys);
  return keySetId;
}
