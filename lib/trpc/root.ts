import { createTRPCRouter } from "@/lib/trpc/trpc";
import { storageRouter } from "@/lib/trpc/router/storageRouter";
import { viewRouter } from "@/lib/trpc/router/viewRouter";
import { feedRouter } from "@/lib/trpc/router/feedRouter";
import { userRouter } from "@/lib/trpc/router/userRouter";
import { walletRouter } from "@/lib/trpc/router/walletRouter";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  storage: storageRouter,
  view: viewRouter,
  feed: feedRouter,
  user: userRouter,
  wallet: walletRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
