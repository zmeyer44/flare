import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const storageRouter = createTRPCRouter({
  credits: protectedProcedure.query(async ({ ctx }) => {
    const storageCredits = await ctx.prisma.storageCredit.aggregate({
      where: {
        pubkey: ctx.session.user.pubkey,
      },
      _sum: {
        bytes: true,
      },
    });
    const uploadsUsed = await ctx.prisma.upload.aggregate({
      where: {
        pubkey: ctx.session.user.pubkey,
      },
      _sum: {
        size: true,
      },
    });
    const remainingCredits =
      (storageCredits._sum.bytes ?? 0) - (uploadsUsed._sum.size ?? 0);
    return remainingCredits;
  }),
  demo: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return { success: true };
    }),
});
