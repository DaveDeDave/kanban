import { ReactQueryOptions, trpc } from "@/config/trpc.config";

export const userGetCurrentUserInfo = (opts: ReactQueryOptions["user"]["getCurrentUserInfo"]) => {
  return trpc.user.getCurrentUserInfo.useQuery(undefined, opts);
};
