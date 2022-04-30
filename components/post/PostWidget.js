import { checkHowManyDaysAgo } from "../utils/date";
import User from "../api/users/User";
import widget from "../../styles/modules/Widget.module.css";
import ChildWidget from "./ChildWidget";
import ActivityWidget from "./ActivityWidget";
import { AccountContext } from "../../components/templates/ContextProvider";

import { useEffect, useState, useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import { BsArrowReturnRight, BsThreeDotsVertical } from "react-icons/bs";
import { ImLocation2 } from "react-icons/im";
import Link from "next/link";
import { Button, Menu, MenuItem, Chip } from "@mui/material";
import { useRouter } from "next/router";
import PostSkeleton, { UserSkeleton } from "./PostSkeleton";
import MenuButton from "../templates/MenuButton";
import DialogButton from "../templates/DialogButton";
import { useSnackbar } from "notistack";

export default function PostWidget({ post, children, noBorder }) {
  // Context

  const accountServices = useContext(AccountContext);
  const { enqueueSnackbar } = useSnackbar();

  // User Who Created Post
  const user = new User(process.env.BACKEND_URL, null, {});

  // useState
  const [close, setClose] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [deleteAlert, triggerDeleteAlert] = useState(false);

  let PostMenu;
  const post_date = new Date(post.data.createdAt);
  const current_date = new Date();
  const how_long_ago = checkHowManyDaysAgo(post_date, current_date);

  const router = useRouter();

  const deleteAction = () => {
    post
      .delete()
      .then((result) => {
        if (result.status === 200) {
          // Close Widget
          enqueueSnackbar(<small>Deleted Post</small>, {
            variant: "success",
            anchorOrigin: { horizontal: "left", vertical: "top" },
          });

          triggerDeleteAlert(false);
          setClose(true);
        }
      })
      .catch((err) => {
        enqueueSnackbar(
          <small>
            <strong>Issue Deleting Post</strong> Try again later.
          </small>,
          {
            variant: "error",
            anchorOrigin: { horizontal: "left", vertical: "top" },
          }
        );

        triggerDeleteAlert(false);
      });
  };

  // Set Menu Items

  if (post.data.user_id === accountServices.id) {
    PostMenu = [
      {
        label: "View Post",
        activity: () => {
          router.push(`/post/${post.data._id}`);
        },
      },
      {
        label: "Hide Post",
        activity: () => {
          setClose(true);
        },
      },
      {
        label: "Delete Post",
        activity: () => {
          triggerDeleteAlert(true);
        },
      },
    ];
  } else {
    PostMenu = [
      {
        label: "View Post",
        activity: () => {
          router.push(`/post/${post.data._id}`);
        },
      },
      {
        label: "Hide Post",
        activity: () => {
          setClose(true);
        },
      },
    ];
  }

  useEffect(() => {
    user.fetchUserInformation(post.data.user_id).then((result) => {
      setUserInfo(
        new User(process.env.BACKEND_URL, null, {
          ...result,
          username: result.user[0].username,
          is_verified: result.is_verified,
          image: result.image,
        })
      );
    });
  }, []);

  // Totally hide component

  if (close) {
    return <></>;
  }

  return (
    <>
      {
        // Alerts and Dialogs
      }
      <DialogButton
        setOpen={triggerDeleteAlert}
        open={deleteAlert}
        actions={
          <>
            <Button
              onClick={() => {
                deleteAction();
              }}
            >
              Delete
            </Button>
            <Button
              onClick={() => {
                triggerDeleteAlert(false);
              }}
            >
              Cancel
            </Button>
          </>
        }
        title={"Delete Post"}
        content={
          <>
            If you delete this post you cannot recover it.{" "}
            <strong>Are you sure you want to delete?</strong>
          </>
        }
      />
      <div
        className={!noBorder && widget.primary}
        onClick={(e) => {
          router.push(`/post/${post.data._id}`);

          if (!e) e = window.event;
          e.cancelBubble = true;
          if (e.stopPropagation) e.stopPropagation();
        }}
      >
        {
          // Body of widget
        }
        <div className="container-flush p-lg-3 p-1 ">
          <div className="row">
            <div
              className="col-8"
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {userInfo ? (
                <div onClick={() => router.push(`/user/${userInfo._id}`)}>
                  {userInfo.displayProfileChip({ borderWidth: "0px" })}
                </div>
              ) : (
                <div className="px-2 pb-1">
                  <UserSkeleton />
                </div>
              )}
            </div>
            <div className="col-4 mx-0">
              <div className="row">
                <p
                  className="text-end col-8 px-0"
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  <small
                    style={{
                      marginLeft: "2px",
                      color: "#636e72",
                      fontSize: "12px",
                      marginBottom: "2px",
                    }}
                  >
                    {how_long_ago}
                  </small>
                </p>
                <p className="col-3 text-end mx-0 px-0">
                  <MenuButton list={PostMenu}>
                    <BsThreeDotsVertical
                      id="basic-button"
                      style={{
                        color: "#2d3436",
                        fontSize: "15px",
                      }}
                    />
                  </MenuButton>
                </p>
              </div>
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
            <div className="mb-2">
              <ChildWidget post_id={post.data.shared_from} />
            </div>
          )}

          <p className="text-end mt-2">
            <Chip
              size="small"
              label={
                post.data.area.city ? (
                  <>
                    <ImLocation2
                      style={{
                        color: "#74b9ff",
                        fontSize: "12px",
                        marginRight: "2px",
                      }}
                    />
                    {post.data.area.city}
                  </>
                ) : (
                  <>
                    <ImLocation2
                      style={{
                        color: "#74b9ff",
                        fontSize: "12px",
                        marginRight: "2px",
                      }}
                    />
                    {post.data.area.state}
                  </>
                )
              }
              variant="outlined"
              sx={{
                fontSize: 10,
                padding: 0.1,
                borderColor: "#74b9ff",
                color: "#74b9ff",
              }}
            />
          </p>

          <ActivityWidget
            post={post}
            likes={
              post.data.activities.find(
                (activity) => activity._id === "like"
              ) || { amount: 0 }
            }
            dislikes={
              post.data.activities.find(
                (activity) => activity._id === "dislike"
              ) || { amount: 0 }
            }
            replies={post.data.replies[0] || null}
            shares={post.data.shares[0] || null}
          />
          {children && children}
        </div>
      </div>
      <hr className={widget.divider} />
    </>
  );
}
