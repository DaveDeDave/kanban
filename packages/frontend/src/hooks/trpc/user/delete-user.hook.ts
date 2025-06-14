import { trpc } from "@/config/trpc.config";

export const useDeleteCurrentUser = () => {
  return trpc.user.deleteUser.useMutation();
};
