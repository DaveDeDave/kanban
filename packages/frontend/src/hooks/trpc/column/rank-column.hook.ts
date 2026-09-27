import { trpc } from "@/config/trpc.config";

// The board owns optimistic column ordering and reconciliation.
export const useRankColumn = () => trpc.column.rankColumn.useMutation();
