import { BottomNavigationAction, BottomNavigation, Paper } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { RiEarthFill } from "react-icons/ri";
import { MdNotificationsNone } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/router";
import { AccountContext } from "../templates/ContextProvider";
import { useSnackbar } from "notistack";

export default function BottomNav() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = useState(0);
  const [pathName, setPathName] = useState(router.pathname);
  const accountService = useContext(AccountContext);

  useEffect(() => {
    if (router.pathname === "/") {
      setValue(1);
    } else if (router.pathname === "/profile") {
      setValue(0);
    } else if (router.pathname === "/notifications") {
      setValue(2);
    } else {
      setValue(null);
    }
  }, [router.pathname]);

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        {accountService.isLoggedIn && (
          <BottomNavigationAction
            label="Profile"
            icon={<FaUserCircle />}
            onClick={() => {
              enqueueSnackbar(
                <small>
                  Profile coming soon where you can see all your posts and add a
                  display name
                </small>,
                {
                  variant: "warning",
                  anchorOrigin: { horizontal: "left", vertical: "top" },
                }
              );
            }}
          />
        )}
        <BottomNavigationAction
          label="Look Around"
          icon={<RiEarthFill />}
          onClick={() => {
            router.push("/");
          }}
        />
        {accountService.isLoggedIn && (
          <BottomNavigationAction
            label="Notification"
            icon={<MdNotificationsNone />}
            onClick={() => {
              router.push("/notifications");
            }}
          />
        )}
      </BottomNavigation>
    </Paper>
  );
}
