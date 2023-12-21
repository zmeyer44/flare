import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { EventSchema } from "@/types";
import { validateEvent } from "nostr-tools";
import { createZodFetcher } from "zod-fetch";
import { getTagValues } from "@/lib/nostr/utils";

export const viewRouter = createTRPCRouter({
  getCount: publicProcedure
    .input(
      z.object({
        kind: z.number(),
        pubkey: z.string(),
        d: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const viewCount = await ctx.prisma.video.findFirst({
        where: {
          ...input,
        },
        select: {
          viewCount: true,
        },
      });
      console.log("At viewcount", viewCount?.viewCount);
      return viewCount?.viewCount ?? 0;
    }),
});
