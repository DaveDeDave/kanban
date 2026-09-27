import { trpc } from "@/config/trpc.config";

// The board owns the optimistic move queue and updates its cache after each acknowledgement.
export const useRankTask = () => trpc.task.rankTask.useMutation();
