import { useEffect, useState } from "react";
import NotificationWidget from "./NotificationWidget";
import style from "../../styles/modules/Notification.module.css";

export default function NotificationListWidget({ notifications, height }) {
  const [list, setList] = useState([]);
  useEffect(() => {
    setList(notifications);
  }, [notifications]);

  const listNotifications = list.map((notification) => (
    <li className="m-0 p-0" key={notification.data._id}>
      <NotificationWidget notification={notification} />
    </li>
  ));

  return (
    <ul style={{ maxHeight: height || "auto" }} className={style.list}>
      {listNotifications}
    </ul>
  );
}
