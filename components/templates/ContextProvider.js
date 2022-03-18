import { createContext, useEffect, useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import User from "../api/users/User";

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
      <>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color="secondary" />
        </Backdrop>
      </>
    );
  }

  return (
    <AccountContext.Provider value={user}>
      <div className="lightmode">{children}</div>
    </AccountContext.Provider>
  );
}
