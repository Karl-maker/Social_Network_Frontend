import widget from "../../styles/modules/Widget.module.css";
import User from "../api/users/User";
import Connection from "../api/Connection";
import { checkHowManyDaysAgo } from "../utils/date";

import { useEffect, useState } from "react";
import { ImLocation2 } from "react-icons/im";

export default function ChildWidget({ post_id }) {
  const connect = new Connection(process.env.BACKEND_URL, null);
  const user = new User(process.env.BACKEND_URL, null);
  const current_date = new Date();
  let how_long_ago;

  const [userInfo, setUserInfo] = useState();
  const [postInfo, setPostInfo] = useState();
  const [errorInfo, setErrorInfo] = useState();

  useEffect(() => {
    connect
      .fetchGetGeneral(`/api/post/${post_id}`)
      .then((result) => {
        if (result.data.length < 1) {
          setErrorInfo({ status: 404, message: "Not Found" });
        } else {
          setPostInfo(result.data[0]);
          how_long_ago = checkHowManyDaysAgo(
            new Date(result.data[0].createdAt),
            current_date
          );
          user.fetchUserInformation(result.data[0].user_id).then((result) => {
            setUserInfo(result);
          });
        }
      })
      .catch((err) => {
        setErrorInfo(err);
      });
  }, []);

  if (errorInfo) {
    return (
      <div className={widget.widget_child}>
        <div className="container-flush p-4 text-center">
          <p style={{ color: "#2f3640" }}>
            <small>{errorInfo.message}</small>
          </p>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return <></>;
  }

  return (
    <div className={widget.widget_child}>
      <div className="container-flush p-4">
        <div className="row">
          <div className="col-6">
            <p style={{ color: "#2f3640" }}>
              <small>
                <strong>{userInfo.display_name}</strong>
              </small>
              <small style={{ marginLeft: "5px" }}>{`@${
                userInfo.user[0].username || ""
              }`}</small>
            </p>
          </div>
          <div className="col-6">
            <p className="text-end">
              <ImLocation2
                style={{
                  color: "#74b9ff",
                  fontSize: "12px",
                }}
              />
              <small
                style={{
                  marginLeft: "2px",
                  color: "#636e72",
                  fontSize: "12px",
                  marginBottom: "2px",
                }}
              >
                {postInfo.area.city}
              </small>
              <small
                style={{
                  marginLeft: "5px",
                  color: "#636e72",
                  fontSize: "12px",
                  marginBottom: "2px",
                }}
              >
                {how_long_ago}
              </small>
            </p>
          </div>
        </div>
        <div className="row">
          <p style={{ color: "#2d3436" }}>{postInfo.content}</p>
        </div>
      </div>
    </div>
  );
}
