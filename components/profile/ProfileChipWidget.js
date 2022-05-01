import { AccountContext } from "../templates/ContextProvider";
import { useContext, useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import widget from "../../styles/modules/Widget.module.css";
import { Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/router";

export default function ProfileChipWidget() {
  const router = useRouter();
  const accountService = useContext(AccountContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logOut = () => {
    accountService.logout().then(() => {
      router.reload(window.location.pathname);
    });
  };

  const viewProfile = () => {
    router.push("/profile");
  };

  const PostMenu = () => {
    return (
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={viewProfile}>View Profile</MenuItem>
        <MenuItem onClick={logOut}>Logout</MenuItem>
      </Menu>
    );
  };

  if (accountService.isLoggedIn)
    return (
      <div className={widget.chip_fill}>
        <div className="container-flush p-2">
          <div className="row d-flex align-items-center">
            {
              // Main Columns
            }
            <div className="col-3">
              <FaUserCircle style={{ fontSize: "40px" }} />
            </div>
            <div className="col-7">
              <div className="row">
                <div className="col-12 m-0 p-0">
                  <p className="m-0">
                    {accountService.display_name && accountService.display_name}
                  </p>
                </div>
                <div className="col-12 m-0 p-0">
                  <p className="m-0">
                    <small>
                      {accountService.username && `@${accountService.username}`}
                    </small>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-2 text-start">
              <BsThreeDotsVertical
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              />
              <PostMenu />
            </div>
            {
              // Main Columns
            }
          </div>
        </div>
      </div>
    );

  return <></>;
}
