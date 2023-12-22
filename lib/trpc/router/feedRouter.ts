import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { EventSchema } from "@/types";
import { validateEvent } from "nostr-tools";
import { createZodFetcher } from "zod-fetch";
import { getTagValues } from "@/lib/nostr/utils";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";
import { uniq } from "ramda";

export const feedRouter = createTRPCRouter({
  getChannelsToWatch: publicProcedure.query(async ({ ctx, input }) => {
    const popularVideos = await ctx.prisma.video.findMany({
      where: {
        published_at: {
          gt: unixTimeNowInSeconds() - 60 * 60 * 24,
        },
      },
      orderBy: {
        viewCount: "desc",
      },
      select: {
        pubkey: true,
      },
      take: 20,
    });
    if (!popularVideos) return [];
    const pubkeys = popularVideos.map((p) => p.pubkey);
    return uniq(pubkeys).slice(0, 14);
  }),
});
