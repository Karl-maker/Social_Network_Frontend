import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import User from "../../../components/api/users/User";
import PostCollection from "../../../components/api/posts/PostCollection";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  CircularProgress,
  IconButton,
  Skeleton,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import { MdKeyboardBackspace } from "react-icons/md";
import { BsChevronCompactDown } from "react-icons/bs";
import widget from "../../../styles/modules/Widget.module.css";
import { useContext } from "react";
import { AccountContext } from "../../../components/templates/ContextProvider";
import PostListWidget from "../../../components/post/PostListWidget";
import PostSkeleton from "../../../components/post/PostSkeleton";
import VisibilitySensor from "react-visibility-sensor";
import { noDuplicateObjects } from "../../../components/utils/array";
import DialogButton from "../../../components/templates/DialogButton";
import EditProfile from "../../../components/profile/EditProfile";

export async function getStaticProps(context) {
  return {
    props: {
      protected: false,
      title: "Profile",
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [
      // String variant:
      "/profile/id",
    ],
    fallback: true,
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const accountServices = useContext(AccountContext);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [buttonLoad, setButtonLoad] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [editProfile, setEditProfile] = useState(false);
  const [postCollection] = useState(
    new PostCollection(
      process.env.BACKEND_URL || "",
      accountServices.access_token || "",
      {}
    )
  );
  const [profile, setProfile] = useState(
    new User(process.env.BACKEND_URL, "", {})
  );

  const LoadMorePrompt = () => {
    if (posts.length < postCollection.total && posts.length != 0) {
      // Show Prompt to get more

      return (
        <VisibilitySensor
          delayedCall={true}
          intervalDelay={1000}
          onChange={(isVisible) => {
            if (isVisible) {
              setButtonLoad(true);
              postCollection.page_number = postCollection.page_number + 1;
              postCollection
                .fetchUserPosts(router.query.id)
                .then(({ data, meta_data }) => {
                  setPosts(noDuplicateObjects(posts.concat(data), "_id"));
                  setLoading(false);
                })
                .catch((err) => {
                  setLoading(false);
                });
            }
          }}
        >
          <div className="m-5 p-3 row">
            <div className="col-12 text-center">
              {buttonLoad ? (
                <CircularProgress />
              ) : (
                <BsChevronCompactDown fontSize={40} />
              )}
            </div>
          </div>
        </VisibilitySensor>
      );
    }

    return <></>;
  };

  useEffect(() => {
    setPosts([]);

    profile
      .fetchUserInformation(router.query.id)
      .then((result) => {
        setProfile(
          new User(process.env.BACKEND_URL, null, {
            ...result,
            username: result.user[0].username,
            is_verified: result.is_verified,
            image: result.image,
            bio: result.bio,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });

    if (accountServices.isLoggedIn) {
      postCollection
        .fetchUserPosts(router.query.id, {})
        .then(async ({ data, meta_data }) => {
          setPosts(data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setPrompt(
            <div className={widget.secondary}>
              <div className="p-5">
                {err.message.toLowerCase() || "Unexpected Error"}
              </div>
            </div>
          );
        });
    } else {
      setPrompt(
        <Button
          variant="outlined"
          sx={{
            borderRadius: "25px",
          }}
          onClick={() => {
            router.push({
              pathname: "/login",
              query: { return_url: router.asPath },
            });
          }}
        >
          Login to view profile
        </Button>
      );
      setLoading(false);
    }
  }, [router.query.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={widget.list}>
      <div className="container px-0">
        <div className="row px-2">
          {
            // Back Button and More info Button
          }
          <div className="col-6 text-start">
            <IconButton onClick={() => router.push("/")}>
              <MdKeyboardBackspace />
            </IconButton>
          </div>
          <div className="col-6 text-end"></div>
        </div>
        <div className="row mt-2">
          {
            // Profile Image
          }
          <div className="col-12 d-flex justify-content-center">
            {profile.username || profile.image ? (
              profile.displayProfilePicture(100)
            ) : (
              <Skeleton variant="circular" width={100} height={100} />
            )}
          </div>
        </div>
        <div className="row mt-3">
          {
            // User's Name
          }
          <div className="text-center d-flex justify-content-center">
            {profile.username ? (
              <>
                {profile.displayProfileChip({
                  onlyUsername: true,
                  borderWidth: "0px",
                  fontSize: "20px",
                })}
              </>
            ) : (
              <Skeleton animation="wave" width={60} />
            )}
          </div>
        </div>
        <div className="row mt-2">
          {
            // User's Bio
          }
          <div className="col-12 text-center text-muted px-4">
            {profile.bio !== null ? (
              profile.bio
            ) : (
              <>
                <Skeleton animation="wave" />
              </>
            )}
          </div>
        </div>
        {router.query.id === accountServices.id && (
          <div className="row mt-3">
            {
              // If current profile belong to user show edit profile button
            }
            <div className="col-12 text-center text-muted ">
              <EditProfile
                open={editProfile}
                setOpen={setEditProfile}
                profile={profile}
              >
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: "25px",
                  }}
                  onClick={() => {
                    setEditProfile(true);
                  }}
                >
                  Edit Profile
                </Button>
              </EditProfile>
            </div>
          </div>
        )}
        {postCollection.total !== 0 && (
          <div className="row mt-3">
            <div className="col-12 text-end">
              <p
                className="text-mute mx-3"
                style={{ fontSize: "10px" }}
              >{`${postCollection.total} posts`}</p>
            </div>
          </div>
        )}
        <div className="row mt-1">
          {
            // Area for showing posts
          }
          {loading ? (
            <>
              {
                // Show loading
              }
              <div className="container-flush p-5 text-center">
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
              </div>
            </>
          ) : (
            <>
              {
                // Show posts
              }
              {posts.length == 0 && (
                <>
                  {!prompt ? (
                    <div className="container-flush p-4 text-center">
                      <p style={{ cursor: "pointer", fontSize: "15px" }}>
                        <div className={widget.secondary}>
                          <div className="p-5">User Has No Posts</div>
                        </div>
                      </p>
                    </div>
                  ) : (
                    <div className="container-flush p-5 text-center">
                      <p style={{ cursor: "pointer", fontSize: "15px" }}>
                        {prompt}
                      </p>
                    </div>
                  )}
                </>
              )}

              <div style={{ paddingBottom: "130px" }}>
                <PostListWidget posts={posts} hr={true} />
                <LoadMorePrompt className="mt-2" />
              </div>

              {/*

        When Scrolled To the end load more content

        */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
