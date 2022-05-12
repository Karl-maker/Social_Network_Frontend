import { createContext, useEffect, useState, useMemo } from "react";
import User from "../api/users/User";
import Loading from "./Loading";
import { useRouter } from "next/router";
import { SnackbarProvider, useSnackbar } from "notistack";
import {
  AiFillCloseCircle,
  AiOutlineWarning,
  AiFillInfoCircle,
} from "react-icons/ai";
import { BiErrorCircle } from "react-icons/bi";
import { BsCheck2Circle } from "react-icons/bs";
import {
  AlertTitle,
  Snackbar,
  Collapse,
  Slide,
  Fade,
  IconButton,
} from "@mui/material";

export const AccountContext = createContext({});

export function ContextProvider({ children }) {
  const router = useRouter();
  const account = useMemo(
    () => new User(process.env.BACKEND_URL || "", "", {}),
    []
  );
  const [user, setUser] = useState(account);
  const [initialize, setInitialize] = useState(true);

  useEffect(() => {
    account.authenticate().then((result) => {
      if (result) setUser(account);

      setInitialize(false);
    });
  }, [account]);

  const DismissAction = ({ id }) => {
    const { closeSnackbar } = useSnackbar();
    return (
      <>
        <IconButton onClick={() => closeSnackbar(id)}>
          <AiFillCloseCircle style={{ color: "#ffff" }} />
        </IconButton>
      </>
    );
  };

  return (
    <AccountContext.Provider value={user}>
      <Loading loading={initialize}>
        <SnackbarProvider
          maxSnack={3}
          action={(key) => <DismissAction id={key} />}
          preventDuplicate
          TransitionComponent={Fade}
          dense
          iconVariant={{
            error: (
              <BiErrorCircle className="m-2" style={{ fontSize: "25px" }} />
            ),
            info: <></>,
            success: (
              <BsCheck2Circle className="m-2" style={{ fontSize: "25px" }} />
            ),
            warning: (
              <AiOutlineWarning className="m-2" style={{ fontSize: "25px" }} />
            ),
          }}
        >
          {/*
           * Alerts will be set from many parts of the app but only displays here
           *
           * The top level allows it to be permistent over page changes
           * This allows for a better user experience
           */}
          <div className="lightmode">{children}</div>
        </SnackbarProvider>
      </Loading>
    </AccountContext.Provider>
  );
}
