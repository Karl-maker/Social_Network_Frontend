import { useRouter } from "next/router";
import widget from "../../styles/modules/Widget.module.css";
import { RiEarthFill } from "react-icons/ri";
import { MdNotificationsNone, MdNotifications } from "react-icons/md";
import { AiFillInfoCircle } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { HiLogout, HiPencil } from "react-icons/hi";
import { AccountContext } from "../templates/ContextProvider";
import { useContext } from "react";
import { useSnackbar } from "notistack";
import { Divider } from "@mui/material";

function Item({ title, icon, link, action }) {
  const router = useRouter();
  return (
    <div
      className={widget.chip}
      onClick={() => {
        link ? router.push(link) : action();
      }}
    >
      <div className="container p-2">
        <div
          className="row d-flex align-items-center"
          style={{ cursor: "pointer" }}
        >
          <div className={"col-12 d-flex align-items-center px-3"}>
            <p
              style={{
                fontSize: "25px",
                marginRight: "15px",
                marginTop: "0px",
                marginBottom: "10px",
              }}
            >
              {icon}
            </p>
            <h5>{title}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SideNav() {
  const { enqueueSnackbar } = useSnackbar();
  const accountService = useContext(AccountContext);
  const router = useRouter();
  return (
    <ul
      style={{
        paddingLeft: "0px",
      }}
    >
      <li>
        <Item title="Post" icon={<HiPencil />} link="/post" />
      </li>
      <li>
        <Item title="Look Around" icon={<RiEarthFill />} link={"/"} />
      </li>
      <li>
        <Item
          title="Notification"
          icon={<MdNotifications />}
          link={`/notifications`}
        />
      </li>
      <li>
        <Item
          title="Profile"
          icon={<FaUserCircle />}
          link={`/profile/${accountService.id}`}
        />
      </li>
      <li>
        <Item title="About" icon={<AiFillInfoCircle />} link={"/about"} />
      </li>
      <Divider />
      <li>
        <Item
          title="Logout"
          icon={<HiLogout />}
          action={() => {
            accountService
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
          }}
        />
      </li>
    </ul>
  );
}
