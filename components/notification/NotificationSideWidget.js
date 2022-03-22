import widget from "../../styles/modules/Widget.module.css";
import { RiNotification3Fill } from "react-icons/ri";
import NotificationCollection from "../api/notifications/NotificationCollection";
import { AccountContext } from "../../components/templates/ContextProvider";
import { useEffect, useState, useContext } from "react";
import { noDuplicateObjects } from "../../components/utils/array";
import NotificationListWidget from "./NotificationListWidget";

export default function NotificationSideWidget() {
  const accountServices = useContext(AccountContext);
  const [notifications, setNotifications] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  let notification_collection = new NotificationCollection(
    process.env.BACKEND_URL,
    accountServices.access_token
  );

  useEffect(() => {
    notification_collection
      .fetchManyNotifications({ page_number: pageNumber, page_size: 10 })
      .then(({ data }) => {
        setNotifications(notifications.concat(data));
      })
      .catch((error) => {
        // Capture Error
      });
  }, [pageNumber]);

  return (
    <div className={widget.primary}>
      <div className="container-flush p-0">
        <div className="row text-center">
          <p
            style={{
              fontSize: "18px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            <small style={{ color: "#7f8fa6" }}>
              <strong>
                <RiNotification3Fill className="m-3 mb-1" />
              </strong>
            </small>
          </p>
        </div>
        <div className="row">
          {/*

                display notifications

                */}
          {notifications.length > 0 && (
            <NotificationListWidget
              notifications={notifications}
              height="72vh"
            />
          )}
        </div>
      </div>
    </div>
  );
}
