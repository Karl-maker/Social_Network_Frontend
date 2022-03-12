import { checkHowManyDaysAgo } from "../utils/date";
import User from "../api/users/User";
import widget from "../../styles/modules/PostWidget.module.css";
import ChildWidget from "./ChildWidget";
import ActivityWidget from "./ActivityWidget";

import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { BsArrowReturnRight } from "react-icons/bs";
import { ImLocation2 } from "react-icons/im";
import Link from "next/link";

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
    <Link href={`/post/${post.data._id}`}>
      <div className={widget.primary}>
        <div className="container-flush p-4">
          <div className="row">
            <div className="col-6">
              <Link href={`/user/${userInfo._id}`}>
                <p>
                  <small>
                    <strong>{userInfo.display_name}</strong>
                  </small>
                  <small style={{ marginLeft: "5px" }}>{`@${
                    userInfo.user[0].username || ""
                  }`}</small>
                </p>
              </Link>
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
              <ChildWidget post_id={post.data.replied_to} />
            </div>
          )}
          <div className="row mt-2">
            <p style={{ color: "#2d3436" }}>
              {post.data.replied_to && (
                <BsArrowReturnRight
                  style={{
                    marginRight: "10px",
                    marginLeft: "10px",
                    fontSize: "15px",
                  }}
                />
              )}
              {post.data.content}
            </p>
          </div>
          {post.data.shared_from && (
            <>
              <ChildWidget post_id={post.data.shared_from} />
            </>
          )}
          <ActivityWidget />
        </div>
      </div>
    </Link>
  );
}
