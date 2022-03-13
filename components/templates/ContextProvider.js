import { createContext } from "react";
import User from "../api/users/User";

export const AccountContext = createContext({});

export function ContextProvider({ children }) {
  const user = new User(
    process.env.BACKEND_URL || "",
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYyMjQzZDMxODNhMDI2YzA1NzM0ZTA3ZSIsImVtYWlsIjoib2ZmaWNpYWxrYXJsNjZAZ21haWwuY29tIn0sImlhdCI6MTY0NzE4MjY4NSwiZXhwIjoxNjQ5Nzc0Njg1fQ.KFt8Mj3dh1h99QBSQxSLiuAdQmuuct92s8Jrextme7bQwWY4NnDJ710Cz05iypCxlEl-5ZVJMBJA7SFbhwAicQ",
    {}
  );

  return (
    <AccountContext.Provider value={user}>
      <div className="lightmode">{children}</div>
    </AccountContext.Provider>
  );
}
