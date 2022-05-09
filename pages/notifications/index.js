import NotificationListWidget from "../../components/notification/NotificationListWidget";
import widget from "../../styles/modules/Widget.module.css";
import { MdNotifications } from "react-icons/md";
import NotificationCollection from "../../components/api/notifications/NotificationCollection";
import { AccountContext } from "../../components/templates/ContextProvider";
import { useEffect, useState, useContext } from "react";
import { noDuplicateObjects } from "../../components/utils/array";

export async function getStaticProps(context) {
  return {
    props: {
      protected: true,
      title: "Notifications",
      description: "See all your notifications.",
    },
  };
}

export default function Notifications() {
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
      <div className="row">
        <div className="col-12 text-center">
          <MdNotifications className="m-3 mb-3 text-muted" />
        </div>
      </div>
      <div className="row" style={{}}>
        <div className="col-12 p-0" style={{ paddingBottom: "180px" }}>
          <NotificationListWidget
            notifications={notifications}
            ul="p-0 m-0"
            li="mx-lg-3"
            height="90vh"
          />
        </div>
      </div>
    </div>
  );
}
