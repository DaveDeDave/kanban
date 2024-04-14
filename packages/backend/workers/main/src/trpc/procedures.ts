import { procedure } from "@/config/trpc.config";
import { withAuthentication } from "./middlewares";

export const publicProcedure = procedure;
export const authProcedure = publicProcedure.use(withAuthentication);
