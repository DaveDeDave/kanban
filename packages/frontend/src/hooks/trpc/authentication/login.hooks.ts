import { ReactQueryOptions, trpc } from "@/config/trpc.config";
import { useNavigate } from "@tanstack/react-router";

export const useLogin = (opts?: ReactQueryOptions["authentication"]["login"]) => {
  const navigate = useNavigate();

  return trpc.authentication.login.useMutation({
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

export const useLogout = ({ onSuccess }: { onSuccess?: () => void }) => {
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  return () => {
    onSuccess?.();
    localStorage.removeItem("accessToken");
    utils.invalidate();
    navigate({
      to: "/auth/login"
    });
  };
};
