import { createTRPCRouter } from "@/lib/trpc/trpc";
import { demoRouter } from "@/lib/trpc/router/demoRouter";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  demo: demoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
