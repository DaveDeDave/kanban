import { QueryClient } from "@tanstack/react-query";
import { trpc } from "./trpc.config";
import { httpBatchLink } from "@trpc/client";
import envConfig from "./env.config";

const customFetch = async (url: URL | RequestInfo, options?: RequestInit) => {
  const accessToken = localStorage.getItem("accessToken");
  const authOptions = {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : ""
    }
  };
  const response = await fetch(url, authOptions);

  if (response.status === 401) {
    const body = (await response.json()) as any;
    const shouldRedirect = body?.find((res: any) => res?.error?.errorCode !== "WrongCredentials");
    if (shouldRedirect) {
      localStorage.removeItem("accessToken");
      window.location.href = "/auth/login";
    }

    return {
      json: () => body
    };
  }

  return response;
};

export const queryClient = new QueryClient();
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: envConfig.VITE_MAIN_WORKER_ENDPOINT,
      fetch: customFetch
    })
  ]
});
