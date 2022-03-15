import { createContext, useEffect, useState } from "react";
import User from "../api/users/User";

export const AccountContext = createContext({});

export function ContextProvider({ children }) {
  const account = new User(process.env.BACKEND_URL || "", "", {});
  const [user, setUser] = useState(account);

  return (
    <AccountContext.Provider value={user}>
      <div className="lightmode">{children}</div>
    </AccountContext.Provider>
  );
}
