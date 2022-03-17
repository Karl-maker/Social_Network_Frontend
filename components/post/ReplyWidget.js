import { checkHowManyDaysAgo } from "../utils/date";
import User from "../api/users/User";
import widget from "../../styles/modules/Widget.module.css";
import ChildWidget from "./ChildWidget";
import ActivityWidget from "./ActivityWidget";
import { AccountContext } from "../../components/templates/ContextProvider";

import { useEffect, useState, useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import { BsArrowReturnRight, BsThreeDotsVertical } from "react-icons/bs";
import { ImLocation2 } from "react-icons/im";
import Link from "next/link";
import { Button, Menu, MenuItem, Chip } from "@mui/material";
import { useRouter } from "next/router";

export default function ReplyWidget({ post }) {
  const user = new User(process.env.BACKEND_URL, null, {});
  const accountServices = useContext(AccountContext);
  const post_date = new Date(post.data.createdAt);
  const current_date = new Date();
  const how_long_ago = checkHowManyDaysAgo(post_date, current_date);
  const [userInfo, setUserInfo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    post.delete().then((result) => {
      if (result.status === 200) {
        router.reload(window.location.pathname);
      }
    });
  };

  useEffect(() => {
    user.fetchUserInformation(post.data.user_id).then((result) => {
      setUserInfo(result);
    });
  }, []);

  if (!userInfo) {
    return <></>;
  }

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
        {post.data.user_id === accountServices.id && (
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        )}
        <Link href={`/post/${post.data._id}`}>
          <MenuItem>View</MenuItem>
        </Link>
      </Menu>
    );
  };

  return (
    <div className={widget.secondary}>
      <div className="container-flush p-4">
        <div className="row">
          <div
            className="col-8"
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            <Link href={`/user/${userInfo._id}`} passHref>
              <p style={{ cursor: "pointer", fontSize: "18px" }}>
                <small>
                  <strong>{userInfo.display_name}</strong>
                </small>
                <small style={{ marginLeft: "5px", fontSize: "14px" }}>{`@${
                  userInfo.user[0].username || ""
                }`}</small>
              </p>
            </Link>
          </div>
          <div className="col-4 mx-0">
            <div className="row">
              <p
                className="text-end col-8 px-0"
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                <small
                  style={{
                    marginLeft: "2px",
                    color: "#636e72",
                    fontSize: "12px",
                    marginBottom: "2px",
                  }}
                >
                  {how_long_ago}
                </small>
              </p>
              <p className="col-3 text-end mx-0 px-0">
                <BsThreeDotsVertical
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  style={{
                    color: "#2d3436",
                    fontSize: "15px",
                  }}
                />
                <PostMenu />
              </p>
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <p style={{ color: "#2d3436" }}>{post.data.content}</p>
        </div>
      </div>
    </div>
  );
}
