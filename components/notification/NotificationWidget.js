import widget from "../../styles/modules/Widget.module.css";
import { checkHowManyDaysAgo } from "../utils/date";
import { GoPrimitiveDot } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/router";
import { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useContext } from "react";
import { useSnackbar } from "notistack";
import { AiFillEye, AiFillDelete } from "react-icons/ai";
import MenuButton from "../templates/MenuButton";

export default function NotificationWidget({ notification }) {
  const { enqueueSnackbar } = useSnackbar();
  const notification_date = new Date(notification.data.createdAt);
  const current_date = new Date();
  const how_long_ago = checkHowManyDaysAgo(notification_date, current_date);
  const router = useRouter();
  const [show, setShow] = useState(true);
  const [seen, setSeen] = useState(notification.data.seen);

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

  if (!show) {
    return <></>;
  }

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
        <div className="col-10 d-flex align-items-center">
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
          className="col-2 d-flex align-items-center p-0 text-end"
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
