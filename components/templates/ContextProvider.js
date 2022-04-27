import { createContext, useEffect, useState } from "react";
import User from "../api/users/User";
import Loading from "./Loading";
import { useRouter } from "next/router";
import AlertWidget from "./Alert";

export const AccountContext = createContext({});
export const AlertContext = createContext({});

export function ContextProvider({ children }) {
  const router = useRouter();
  const account = new User(process.env.BACKEND_URL || "", "", {});
  const [user, setUser] = useState(account);
  const [alert, setAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({});
  const [initialize, setInitialize] = useState(true);

  useEffect(() => {
    account.authenticate().then((result) => {
      if (result) setUser(account);

      setInitialize(false);
    });
  }, []);

  return (
    <AccountContext.Provider value={user}>
      <AlertContext.Provider value={{ setAlertInfo, setAlert }}>
        <Loading loading={initialize}>
          {/*
           * Alerts will be set from many parts of the app but only displays here
           *
           * The top level allows it to be permistent over page changes
           * This allows for a better user experience
           */}
          <AlertWidget
            open={alert}
            setOpen={setAlert}
            duration={alertInfo.duration}
            severity={alertInfo.severity}
            content={alertInfo.content}
            title={alertInfo.title}
            vertical={alertInfo.vertical}
            horizontal={alertInfo.horizontal}
          />
          <div className="lightmode">{children}</div>
        </Loading>
      </AlertContext.Provider>
    </AccountContext.Provider>
  );
}
