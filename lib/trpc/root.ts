import { createTRPCRouter } from "@/lib/trpc/trpc";
import { storageRouter } from "@/lib/trpc/router/storageRouter";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  storage: storageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
