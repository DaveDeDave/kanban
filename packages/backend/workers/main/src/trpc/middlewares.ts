import { middleware } from "@/config/trpc.config";

export const withAuthentication = middleware(async ({ ctx, next }) => {
  const user = await ctx.services.authentication.authenticate(ctx.headers.get("authorization"));
  return next({ ctx: { user } });
});
