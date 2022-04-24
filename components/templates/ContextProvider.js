import { createContext, useEffect, useState } from "react";
import User from "../api/users/User";
import Loading from "./Loading";
import { useRouter } from "next/router";

export const AccountContext = createContext({});

export function ContextProvider({ children }) {
  const router = useRouter();
  const account = new User(process.env.BACKEND_URL || "", "", {});
  const [user, setUser] = useState(account);
  const [initialize, setInitialize] = useState(true);

  useEffect(() => {
    account.authenticate().then((result) => {
      if (result) setUser(account);

      setInitialize(false);
    });
  }, []);

  return (
    <AccountContext.Provider value={user}>
      <Loading loading={initialize}>
        <div className="lightmode">{children}</div>
      </Loading>
    </AccountContext.Provider>
  );
}
