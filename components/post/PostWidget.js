import { checkHowManyDaysAgo } from "../utils/date";
import User from "../api/users/User";
import widget from "../../styles/modules/Widget.module.css";
import ChildWidget from "./ChildWidget";

import { useEffect, useState } from "react";
import { ImLocation2 } from "react-icons/im";

export default function PostWidget({ post }) {
  const user = new User(process.env.BACKEND_URL, null);
  const post_date = new Date(post.data.createdAt);
  const current_date = new Date();
  const how_long_ago = checkHowManyDaysAgo(post_date, current_date);

  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    user.fetchUserInformation(post.data.user_id).then((result) => {
      setUserInfo(result);
    });
  }, []);

  if (!userInfo) {
    return <></>;
  }

  return (
    <div className={widget.widget}>
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
                {post.data.area.city}
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
        {post.data.replied_to && (
          <div
            style={{
              marginBottom: "0px",
              marginTop: "0px",
            }}
            className="mb-4"
          >
            <p style={{ color: "#2f3640" }}>
              <small
                style={{
                  color: "#636e72",
                  fontSize: "12px",
                  marginBottom: "0px",
                  marginTop: "0px",
                }}
              >
                Replied to
              </small>
            </p>
            <ChildWidget post_id={post.data.replied_to} />
          </div>
        )}
        <div className="row">
          <p style={{ color: "#2d3436" }}>{post.data.content}</p>
        </div>
        {post.data.shared_from && (
          <>
            <p style={{ color: "#2f3640" }} className="mt-0">
              <small
                style={{
                  color: "#636e72",
                  fontSize: "12px",
                  marginBottom: "0px",
                }}
              >
                Shared
              </small>
            </p>
            <ChildWidget post_id={post.data.shared_from} />
          </>
        )}
      </div>
    </div>
  );
}
