import widget from "../../styles/modules/Widget.module.css";
import User from "../api/users/User";
import Connection from "../api/Connection";
import { checkHowManyDaysAgo } from "../utils/date";

import { useEffect, useState } from "react";
import { ImLocation2 } from "react-icons/im";
import PostSkeleton from "./PostSkeleton";
import Link from "next/link";

export default function ChildWidget({ post_id }) {
  const connect = new Connection(process.env.BACKEND_URL, null);
  const user = new User(process.env.BACKEND_URL, null, {});
  const current_date = new Date();
  let how_long_ago;

  const [userInfo, setUserInfo] = useState();
  const [postInfo, setPostInfo] = useState();
  const [errorInfo, setErrorInfo] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    connect
      .fetchGetGeneral(`/api/post/${post_id}`)
      .then((result) => {
        if (result.data.length < 1) {
          setErrorInfo({ status: 404, message: "Post Not Found" });
        } else {
          setPostInfo(result.data[0]);
          how_long_ago = checkHowManyDaysAgo(
            new Date(result.data[0].createdAt),
            current_date
          );
          user.fetchUserInformation(result.data[0].user_id).then((result) => {
            setUserInfo(
              new User(process.env.BACKEND_URL, null, {
                ...result,
                username: result.user[0].username,
              })
            );
          });
        }

        setLoading(false);
      })
      .catch((err) => {
        setErrorInfo(err);
      });
  }, []);

  if (errorInfo) {
    return (
      <div className={widget.secondary}>
        <div className="container-flush p-4 text-center">
          <p>
            <small>{errorInfo.message}</small>
          </p>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return <></>;
  }

  if (loading) {
    return (
      <div className="container-flush p-0">
        <PostSkeleton />
      </div>
    );
  }

  return (
    <Link href={`/post/${postInfo._id}`}>
      <div className={widget.secondary}>
        <div className="container-flush p-3">
          <div className="row">
            <div className="col-10 mb-3">
              <Link href={`/profile/${postInfo.user_id}`}>
                {userInfo.displayProfileChip({ borderWidth: "0px" })}
              </Link>
            </div>
          </div>
          <div className="row">
            <p>{postInfo.content}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
