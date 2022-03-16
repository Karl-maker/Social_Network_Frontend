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

  return (
    <div className={widget.secondary}>
      <div className="container-flush p-4">
        <div className="row">
          <div className="col-10">
            <p>
              <small>
                <strong>{userInfo.display_name}</strong>
              </small>
              <small style={{ marginLeft: "5px" }}>{`@${
                userInfo.user[0].username || ""
              }`}</small>
            </p>
          </div>
        </div>
        <div className="row">
          <p>{postInfo.content}</p>
        </div>
      </div>
    </div>
  );
}
