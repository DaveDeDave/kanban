import { ReactQueryOptions, trpc } from "@/config/trpc.config";
import { useNavigate } from "@tanstack/react-router";

export const useRegister = (opts?: ReactQueryOptions["authentication"]["register"]) => {
  const navigate = useNavigate();

  return trpc.authentication.register.useMutation({
    ...opts,
    onSuccess: (response, variables, context) => {
      opts?.onSuccess?.(response, variables, context);
      localStorage.setItem("accessToken", response.token);
      navigate({
        to: "/app/boards"
      });
    }
  });
};
