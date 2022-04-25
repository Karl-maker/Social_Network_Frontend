import { useRouter } from "next/router";
import widget from "../../styles/modules/Widget.module.css";
import { RiEarthFill } from "react-icons/ri";
import { MdNotificationsNone } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { HiPencil } from "react-icons/hi";
import { AccountContext, AlertContext } from "../templates/ContextProvider";
import { useContext } from "react";

function Item({ title, icon, link }) {
  const router = useRouter();
  return (
    <div
      className={widget.chip}
      onClick={() => {
        router.push(link || "/");
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
  const alertServices = useContext(AlertContext);
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
      <li
        onClick={() => {
          alertServices.setAlertInfo({
            severity: "warning",
            title: "No Profile Yet",
            content:
              "Profile coming soon where you can see all your posts and add a display name",
          });
          alertServices.setAlert(true);
        }}
      >
        <Item title="Profile" icon={<FaUserCircle />} link="/" />
      </li>
      <li>
        <Item
          title="Notifications"
          icon={<MdNotificationsNone />}
          link="/notifications"
        />
      </li>
    </ul>
  );
}
