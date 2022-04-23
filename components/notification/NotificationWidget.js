import widget from "../../styles/modules/Widget.module.css";
import { checkHowManyDaysAgo } from "../utils/date";
import { GoPrimitiveDot } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/router";
import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";

export default function NotificationWidget({ notification }) {
  const notification_date = new Date(notification.data.createdAt);
  const current_date = new Date();
  const how_long_ago = checkHowManyDaysAgo(notification_date, current_date);
  const router = useRouter();
  const [seen, setSeen] = useState(notification.data.seen);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClick = (e) => {
    // Set to seen and go to link...

    notification.seen().then((result) => {
      setSeen(true);
      router.push(`${notification.data.link}`);
    });
  };

  const handleDelete = (e) => {
    notification.delete().then(() => {
      router.reload(window.location.pathname);
    });
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
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
        <MenuItem onClick={onClick}>View</MenuItem>
      </Menu>
    );
  };

  return (
    <div className={widget.list_with_link}>
      <div className="p-2 m-0 row">
        <div className="col-8 d-flex align-items-center">
          <p
            style={{ color: "#718093", marginLeft: "15px" }}
            className="p-2 m-0"
          >
            <small>{notification.data.content}</small>
            <small
              style={{ fontSize: "10px", color: "#0984e3", marginLeft: "5px" }}
            >
              {how_long_ago}
            </small>
          </p>
        </div>
        <div
          className="col-2 d-flex align-items-center"
          style={{ alignContent: "center" }}
        >
          {!seen && <GoPrimitiveDot style={{ color: "#0984e3" }} />}
        </div>
        <div
          className="col-2 d-flex align-items-center p-0 text-end"
          style={{ alignContent: "center", fontSize: "10px" }}
        >
          <BsThreeDotsVertical
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            style={{
              color: "#2d3436",
              fontSize: "12px",
              marginLeft: "20px",
            }}
          />
          <PostMenu />
        </div>
      </div>
    </div>
  );
}
