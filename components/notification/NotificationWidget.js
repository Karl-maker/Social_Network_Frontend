import widget from "../../styles/modules/Widget.module.css";
import { checkHowManyDaysAgo } from "../utils/date";
import { GoPrimitiveDot } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useContext } from "react";
import { useSnackbar } from "notistack";
import { AiFillEye, AiFillDelete } from "react-icons/ai";
import MenuButton from "../templates/MenuButton";
import User from "../api/users/User";

export default function NotificationWidget({ notification }) {
  const { enqueueSnackbar } = useSnackbar();
  const notification_date = new Date(notification.data.createdAt);
  const current_date = new Date();
  const how_long_ago = checkHowManyDaysAgo(notification_date, current_date);
  const router = useRouter();
  const [show, setShow] = useState(true);
  const [seen, setSeen] = useState(notification.data.seen);
  const [hasUserInfo, setHasUserInfo] = useState(false);
  const [user, setUser] = useState(
    new User(process.env.BACKEND_URL, null, {
      username: notification.data.content.split(" ")[0],
    })
  );

  const onClick = () => {
    // Set to seen and go to link...

    notification.seen().then((result) => {
      setSeen(true);
    });

    router.push(`${notification.data.link}`);
  };

  const handleDelete = () => {
    notification
      .delete()
      .then(() => {
        setShow(false);
        enqueueSnackbar("Nofification Deleted", {
          variant: "success",
          anchorOrigin: { horizontal: "left", vertical: "top" },
        });
      })
      .catch((error) => {
        enqueueSnackbar("Issue Nofification Deleted", {
          variant: "error",
          anchorOrigin: { horizontal: "left", vertical: "top" },
        });
      });
  };

  useEffect(() => {
    if (notification.data.done_by) {
      user
        .fetchUserInformation(notification.data.done_by)
        .then((result) => {
          setUser((user) => user);
          setHasUserInfo(true);
        })
        .catch((error) => {});
    }
  }, [notification.data.done_by]);

  if (!show) {
    return <></>;
  }

  if (notification.data.type === "post_interaction") {
    return (
      <div className={widget.list_with_link}>
        <div
          className="p-2 m-0 row"
          onClick={(e) => {
            notification.seen().then((result) => {
              setSeen(true);
            });

            router.push(`${notification.data.link}`);
          }}
        >
          {
            // Main Body
          }
          <div className="col-10 d-flex align-items-center px-4 py-2">
            <div className="container p-0 m-0">
              <div className="row">
                <div className="col-12 p-0 m-0">
                  {
                    // Icon to show it has to do with a post?
                  }
                </div>
              </div>
              <div className="row">
                <div className="col-12 p-0 m-0 d-flex flex-row">
                  {hasUserInfo && (
                    <div
                      onClick={(e) => {
                        router.push(`/profile/${user.id}`);
                        if (!e) e = window.event;
                        e.cancelBubble = true;
                        if (e.stopPropagation) e.stopPropagation();
                      }}
                      className="mx-1"
                    >
                      {user.displayProfilePicture(35)}
                    </div>
                  )}
                  <p style={{ color: "#718093" }} className="p-1 m-0">
                    <small>
                      <strong
                        onClick={(e) => {
                          router.push(`/profile/${user.id}`);

                          if (!e) e = window.event;
                          e.cancelBubble = true;
                          if (e.stopPropagation) e.stopPropagation();
                        }}
                      >
                        {user.username}
                      </strong>
                      {notification.data.content.slice(
                        notification.data.content.indexOf(user.username) +
                          user.username.length
                      )}
                    </small>
                    <small
                      className="text-muted"
                      style={{
                        fontSize: "10px",

                        marginLeft: "5px",
                      }}
                    >
                      {how_long_ago}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {
            // Info and Seen
          }

          <div
            className="col-2 d-flex align-items-center p-0 m-0 text-end"
            style={{ alignContent: "center", fontSize: "10px" }}
          >
            {!seen ? (
              <GoPrimitiveDot style={{ color: "#0984e3" }} />
            ) : (
              <GoPrimitiveDot style={{ color: "transparent" }} />
            )}
            <MenuButton
              list={[
                {
                  icon: <AiFillEye />,
                  label: "View",
                  activity: () => {
                    onClick();
                  },
                },
              ]}
              section={[
                {
                  icon: <AiFillDelete />,
                  label: "Delete",
                  activity: () => {
                    handleDelete();
                  },
                },
              ]}
            >
              <BsThreeDotsVertical
                style={{
                  color: "#2d3436",
                  fontSize: "12px",
                  marginLeft: "20px",
                }}
              />
            </MenuButton>
          </div>
        </div>
      </div>
    );
  }

  return <></>;
}
