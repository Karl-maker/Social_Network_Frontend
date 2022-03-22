import Link from "next/link";
import widget from "../../styles/modules/Widget.module.css";
import { RiHome2Line } from "react-icons/ri";
import { MdNotificationsNone } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { HiPencil } from "react-icons/hi";

function Item({ title, icon }) {
  return (
    <div className={widget.chip}>
      <div className="container-flush p-2">
        <div
          className="row d-flex align-items-center"
          style={{ cursor: "pointer" }}
        >
          <div className={"col-12 d-flex align-items-center px-3"}>
            <p
              style={{
                fontSize: "25px",
                marginRight: "15px",
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
  return (
    <ul>
      <li>
        <Link href="/">
          <Item title="Home" icon={<RiHome2Line />} />
        </Link>
      </li>
      <li>
        <Link href="/post">
          <Item title="Post" icon={<HiPencil />} />
        </Link>
      </li>
      <li>
        <Link href="/profile">
          <Item title="Profile" icon={<FaUserCircle />} />
        </Link>
      </li>
      <li>
        <Link href="/notifications">
          <Item title="Notifications" icon={<MdNotificationsNone />} />
        </Link>
      </li>
    </ul>
  );
}
