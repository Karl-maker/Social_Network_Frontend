import widget from "../../styles/modules/Widget.module.css";
import { RiNotification3Fill } from "react-icons/ri";

export default function NotificationSideWidget() {
  return (
    <div className={widget.primary}>
      <div className="container-flush p-4">
        <div className="row">
          <p style={{ fontSize: "18px" }}>
            <small>
              <strong>
                Notification <RiNotification3Fill className="mx-1 mb-1" />
              </strong>
            </small>
          </p>
        </div>
        <div className="row">
          {/*

                display notifications

                */}
        </div>
      </div>
    </div>
  );
}
