import { RouterOutputs } from "@/config/trpc.config";
import { useLogin, useLogout } from "@/hooks/trpc/authentication/login.hooks";
import { useRegister } from "@/hooks/trpc/authentication/register.hooks";
import { userGetCurrentUserInfo } from "@/hooks/trpc/user/user.hooks";
import { createContext, FC, PropsWithChildren, useState } from "react";

interface IAppContext {
  register: ReturnType<typeof useRegister>;
  login: ReturnType<typeof useLogin>;
  logout: ReturnType<typeof useLogout>;
  isUserLoggedIn: boolean;
  user?: RouterOutputs["user"]["getCurrentUserInfo"];
}

export const AppContext = createContext<IAppContext | null>(null);

export const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));

  const { data: userData } = userGetCurrentUserInfo({
    enabled: Boolean(accessToken)
  });

  const register = useRegister({
    onSuccess: ({ token }) => setAccessToken(token)
  });

  const login = useLogin({
    onSuccess: ({ token }) => setAccessToken(token)
  });

  const logout = useLogout({
    onSuccess: () => setAccessToken(null)
  });

  return (
    <AppContext.Provider
      value={{
        register,
        login,
        logout,
        isUserLoggedIn: Boolean(accessToken),
        user: userData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
