import { BottomNavigationAction, BottomNavigation, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import { RiEarthFill } from "react-icons/ri";
import { MdNotificationsNone, MdOutlinePeopleAlt } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/router";

export default function BottomNav() {
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [pathName, setPathName] = useState(router.pathname);

  useEffect(() => {
    if (router.pathname === "/") {
      setValue(1);
    } else if (router.pathname === "/profile") {
      setValue(0);
    } else if (router.pathname === "/further-away") {
      setValue(2);
    } else if (router.pathname === "/notifications") {
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
        <BottomNavigationAction
          label="Profile"
          icon={<FaUserCircle />}
          onClick={() => {
            router.push("/profile");
          }}
        />
        <BottomNavigationAction
          label="Close By"
          icon={<MdOutlinePeopleAlt />}
          onClick={() => {
            router.push("/");
          }}
        />
        <BottomNavigationAction
          label="Further"
          icon={<RiEarthFill />}
          onClick={() => {
            router.push("/further-away");
          }}
        />
        <BottomNavigationAction
          label="Notification"
          icon={<MdNotificationsNone />}
          onClick={() => {
            router.push("/notifications");
          }}
        />
      </BottomNavigation>
    </Paper>
  );
}
