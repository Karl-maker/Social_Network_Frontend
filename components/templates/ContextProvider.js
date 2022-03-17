import { createContext, useEffect, useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import User from "../api/users/User";
import Image from "next/image";

export const AccountContext = createContext({});

export function ContextProvider({ children }) {
  const account = new User(process.env.BACKEND_URL || "", "", {});
  const [user, setUser] = useState(account);
  const [initialize, setInitialize] = useState(true);

  useEffect(() => {
    account.authenticate().then((result) => {
      if (result) setUser(account);

      setInitialize(false);
    });
  }, []);

  if (initialize) {
    return (
      <div className="mx-auto d-block">
        <Image src="/logo192.png" alt="Syncviz Logo" width={70} height={70} />
      </div>
    );
  }

  return (
    <AccountContext.Provider value={user}>
      <div className="lightmode">{children}</div>
    </AccountContext.Provider>
  );
}
