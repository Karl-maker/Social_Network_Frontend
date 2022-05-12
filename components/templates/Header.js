import { useEffect, useState, useContext } from "react";
import { AccountContext } from "./ContextProvider";
import { FaUserCircle } from "react-icons/fa";
import { HiLogout } from "react-icons/hi";
import { IoWater } from "react-icons/io";
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
import MenuButton from "./MenuButton";
import { useSnackbar } from "notistack";

export default function Header({}) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const accountServices = useContext(AccountContext);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (accountServices.isLoggedIn) setUsername(accountServices.username);
  }, []);

  return (
    <div className="container-fluid p-0 m-0">
      <div className="row">
        <div className="col-4 px-4 m-0">
          <Link href="/" passHref>
            <Image
              src="/dripplie-banner(blue).svg"
              height={70}
              width={100}
              alt="Dripplie-Banner"
            />
          </Link>
        </div>
        <div className="col-8 d-flex justify-content-end align-items-center px-4 ">
          {accountServices.isLoggedIn ? (
            <MenuButton
              list={[
                {
                  icon: accountServices.displayProfilePicture(25),
                  label: "Profile",
                  activity: () => {
                    router.push(`/profile/${accountServices._id}`);
                  },
                },
              ]}
              section={[
                {
                  icon: <HiLogout />,
                  label: "Logout",
                  activity: () => {
                    accountServices
                      .logout()
                      .then(() => {
                        router.push("/");
                      })
                      .catch((error) => {
                        enqueueSnackbar("Issue Logging Out, Try Again Later", {
                          variant: "error",
                          anchorOrigin: { horizontal: "left", vertical: "top" },
                        });
                      });
                  },
                },
              ]}
              horizontal="left"
              vertical="bottom"
            >
              {accountServices.displayProfileChip({ borderWidth: "0px" })}
            </MenuButton>
          ) : (
            <Button
              variant="outlined"
              href="/login"
              sx={{
                borderRadius: "15px",
                paddingX: "25px",
                border: "1px solid",
              }}
              disableElevation
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
