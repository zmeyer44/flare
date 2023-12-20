import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { EventSchema } from "@/types";
import { validateEvent } from "nostr-tools";
import { createZodFetcher } from "zod-fetch";
import { getTagValues } from "@/lib/nostr/utils";

const fetchWithZod = createZodFetcher();
const ZapEndpointResponseSchema = z.object({
  nostrPubkey: z.string(),
});

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
      (Number(storageCredits._sum.bytes) ?? 0) -
      (Number(uploadsUsed._sum.size) ?? 0);
    return remainingCredits;
  }),
  purchaseCredits: protectedProcedure
    .input(
      z.object({
        zapEndpoint: z.string(),
        paymentEvent: EventSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const isValidEvent = validateEvent(input.paymentEvent);
      if (!isValidEvent) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const { nostrPubkey } = await fetchWithZod(
        // The schema you want to validate with
        ZapEndpointResponseSchema,
        // Any parameters you would usually pass to fetch
        input.zapEndpoint,
        {
          method: "GET",
        },
      );
      if (!nostrPubkey) {
        console.log("Unable to find pubkey");
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const description = getTagValues("description", input.paymentEvent.tags);
      if (!description) {
        console.log("Unable to find description tag");
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const paymentRequest = EventSchema.parse(JSON.parse(description));
      const amount = parseInt(
        getTagValues("amount", paymentRequest.tags) as string,
      );
      if (isNaN(amount)) {
        console.log("Unable to find amount tag");
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const paymentEventId = input.paymentEvent.id;

      if (!paymentEventId) {
        console.log("Missing ID");
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      if (
        nostrPubkey !== input.paymentEvent.pubkey ||
        Math.floor(amount / 1000) < 10_000
      ) {
        console.log("Invalid zap");
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const newCredits = await ctx.prisma.storageCredit.create({
        data: {
          bytes: 2_147_483_648,
          pubkey: ctx.session.user.pubkey,
          paymentEventId: paymentEventId,
          paymentEvent: JSON.stringify(input.paymentEvent),
        },
      });
      return { newCredits };
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
