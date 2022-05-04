import { BottomNavigationAction, BottomNavigation, Paper } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { RiEarthFill } from "react-icons/ri";
import { MdNotifications } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { AiFillSetting } from "react-icons/ai";
import { useRouter } from "next/router";
import { AccountContext } from "../templates/ContextProvider";

export default function BottomNav() {
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [pathName, setPathName] = useState(router.pathname);
  const accountService = useContext(AccountContext);

  useEffect(() => {
    if (router.pathname === "/") {
      setValue(1);
    } else if (router.pathname.includes("profile")) {
      setValue(0);
    } else if (router.pathname.includes("notifications")) {
      setValue(2);
    } else if (router.pathname.includes("settings")) {
      setValue(3);
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
            icon={accountService.displayProfilePicture(25)}
            onClick={() => {
              router.push(`/profile/${accountService.id}`);
            }}
          />
        )}
        <BottomNavigationAction
          icon={<RiEarthFill fontSize={25} />}
          onClick={() => {
            router.push("/");
          }}
        />
        {accountService.isLoggedIn && (
          <BottomNavigationAction
            icon={<MdNotifications fontSize={25} />}
            onClick={() => {
              router.push("/notifications");
            }}
          />
        )}
        {accountService.isLoggedIn && (
          <BottomNavigationAction
            icon={<AiFillSetting fontSize={25} />}
            onClick={() => {
              router.push("/settings");
            }}
          />
        )}
      </BottomNavigation>
    </Paper>
  );
}
