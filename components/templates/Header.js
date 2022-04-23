import { useEffect, useState, useContext } from "react";
import { AccountContext } from "./ContextProvider";
import { FaUserCircle } from "react-icons/fa";
import { HiLogout } from "react-icons/hi";
import DrawerButton from "./DrawerButton";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

export default function Header({}) {
  const router = useRouter();
  const accountServices = useContext(AccountContext);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (accountServices.isLoggedIn) setUsername(accountServices.username);
  }, []);

  const menu = (
    <List>
      <Divider />
      <ListItem
        button
        onClick={() => {
          // Log user out
          accountServices.logout();
          router.push("/");
        }}
      >
        <ListItemIcon>
          {
            // Icons come here
          }
          <HiLogout />
        </ListItemIcon>
        <ListItemText primary={"Log Out"} />
      </ListItem>
    </List>
  );

  return (
    <>
      <div className="col-4 px-4 m-0">
        <Link href="/" passHref>
          <Image src="/logo192.png" alt="Syncviz Logo" width={70} height={70} />
        </Link>
      </div>
      <div className="col-8 text-end px-4">
        {accountServices.isLoggedIn ? (
          <DrawerButton anchor={"right"} element={menu}>
            {accountServices.displayProfileChip({
              borderWidth: "0px",
              link: false,
            })}
          </DrawerButton>
        ) : (
          <Button
            variant="contained"
            href="/login"
            sx={{
              borderRadius: "20px",
              borderColor: "transparent",
              backgroundColor: "#2980b9",
            }}
            disableElevation
          >
            Login
          </Button>
        )}
      </div>
    </>
  );
}
