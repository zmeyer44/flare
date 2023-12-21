import { createTRPCRouter } from "@/lib/trpc/trpc";
import { storageRouter } from "@/lib/trpc/router/storageRouter";
import { viewRouter } from "@/lib/trpc/router/viewRouter";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  storage: storageRouter,
  view: viewRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
