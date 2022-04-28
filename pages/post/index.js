import { AccountContext } from "../../components/templates/ContextProvider";
import Post from "../../components/api/posts/Post";
import widget from "../../styles/modules/Widget.module.css";
import ChildWidget from "../../components/post/ChildWidget";

import { useContext, useEffect, useState } from "react";
import { ImLocation2 } from "react-icons/im";
import { GrSend } from "react-icons/gr";
import { MdKeyboardBackspace } from "react-icons/md";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSnackbar } from "notistack";

export async function getStaticProps(context) {
  return {
    props: {
      protected: true,
      title: "Create",
      description: "Create a post for others in your area to view.",
    },
  };
}

export default function CreatePostPage() {
  const { enqueueSnackbar } = useSnackbar();
  const accountServices = useContext(AccountContext);
  const [content, setContent] = useState("");
  const [rows, setRows] = useState(5);
  const [showPostButton, setShowPostButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.query.share) {
      setRows(3);
    } else if (router.query.reply) {
      setRows(2);
    }

    try {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state == "granted") {
            setShowPostButton(true);
          } else if (result.state == "prompt") {
            setShowPostButton(true);
          } else if (result.state == "denied") {
            setShowPostButton(true);
            enqueueSnackbar(
              <small>
                <strong>GeoLocation Not Avaliable</strong> location for this
                post won't be accurate
              </small>,
              {
                variant: "info",
                anchorOrigin: { horizontal: "left", vertical: "top" },
              }
            );
          }
        })
        .catch((err) => {
          enqueueSnackbar(
            <small>
              <strong>GeoLocation Not Supported By Browser</strong> location for
              this post won't be accurate
            </small>,
            {
              variant: "info",
              anchorOrigin: { horizontal: "left", vertical: "top" },
            }
          );
          setShowPostButton(true);
        });
    } catch (err) {
      setShowPostButton(true);
    }
  }, []);

  const handleSubmit = (e) => {
    let coordinates = { latitude: null, longitude: null };

    try {
      navigator.geolocation.getCurrentPosition(
        (result) => {
          const { latitude, longitude } = result.coords;

          coordinates.latitude = latitude;
          coordinates.longitude = longitude;

          const post = new Post(
            process.env.BACKEND_URL,
            accountServices.access_token,
            { coordinates }
          );

          if (router.query.share) {
            post
              .createAShare(content, router.query.share)
              .then((result) => {
                setLoading(false);
                if (result.status === 200) {
                  enqueueSnackbar(<small>Post Shared</small>, {
                    variant: "success",
                    anchorOrigin: { horizontal: "left", vertical: "top" },
                  });

                  router.push("/");
                } else {
                  enqueueSnackbar(<small>Issue Sharing Post</small>, {
                    variant: "error",
                    anchorOrigin: { horizontal: "left", vertical: "top" },
                  });
                }
              })
              .catch((err) => {
                enqueueSnackbar(<small>Issue Sharing Post</small>, {
                  variant: "error",
                  anchorOrigin: { horizontal: "left", vertical: "top" },
                });
              });
          } else if (router.query.reply) {
            post
              .createAReply(content, router.query.reply)
              .then((result) => {
                setLoading(false);
                if (result.status === 200) {
                  enqueueSnackbar(<small>Response Created</small>, {
                    variant: "success",
                    anchorOrigin: { horizontal: "left", vertical: "top" },
                  });

                  router.push("/");
                } else {
                  enqueueSnackbar(<small></small>, {
                    variant: "error",
                    anchorOrigin: { horizontal: "left", vertical: "top" },
                  });
                }
              })
              .catch((err) => {
                enqueueSnackbar(<small>Issue Responding To Post</small>, {
                  variant: "error",
                  anchorOrigin: { horizontal: "left", vertical: "top" },
                });
              });
          } else {
            post
              .create(content)
              .then((result) => {
                setLoading(false);
                if (result.status === 200) {
                  enqueueSnackbar(<small>Post Created</small>, {
                    variant: "success",
                    anchorOrigin: { horizontal: "left", vertical: "top" },
                  });
                  router.push("/");
                } else {
                  enqueueSnackbar(<small>Issue</small>, {
                    variant: "error",
                    anchorOrigin: { horizontal: "left", vertical: "top" },
                  });
                }
              })
              .catch((err) => {
                enqueueSnackbar(<small>Issue Creating Post</small>, {
                  variant: "error",
                  anchorOrigin: { horizontal: "left", vertical: "top" },
                });
              });
          }
        },
        (error) => {
          const post = new Post(
            process.env.BACKEND_URL,
            accountServices.access_token,
            { coordinates }
          );

          if (router.query.share) {
            post
              .createAShare(content, router.query.share)
              .then((result) => {
                setLoading(false);
                if (result.status === 200) {
                  enqueueSnackbar(<small>Post Shared</small>, {
                    variant: "success",
                    anchorOrigin: { horizontal: "left", vertical: "top" },
                  });

                  router.push("/");
                } else {
                  enqueueSnackbar(<small>Issue Sharing Post</small>, {
                    variant: "error",
                    anchorOrigin: { horizontal: "left", vertical: "top" },
                  });
                }
              })
              .catch((err) => {
                setLoading(false);
                enqueueSnackbar(<small>Issue Sharing Post</small>, {
                  variant: "error",
                  anchorOrigin: { horizontal: "left", vertical: "top" },
                });
              });
          } else if (router.query.reply) {
            post
              .createAReply(content, router.query.reply)
              .then((result) => {
                setLoading(false);
                if (result.status === 200) {
                  enqueueSnackbar(<small>Responded To Post</small>, {
                    variant: "success",
                    anchorOrigin: { horizontal: "left", vertical: "top" },
                  });

                  router.push("/");
                } else {
                  enqueueSnackbar(<small>Issue Responding To Post</small>, {
                    variant: "error",
                    anchorOrigin: { horizontal: "left", vertical: "top" },
                  });
                }
              })
              .catch((err) => {
                setLoading(false);
                enqueueSnackbar(<small>Issue Responding To Post</small>, {
                  variant: "error",
                  anchorOrigin: { horizontal: "left", vertical: "top" },
                });
              });
          } else {
            post
              .create(content)
              .then((result) => {
                setLoading(false);
                if (result.status === 200) {
                  enqueueSnackbar(<small>Post Created</small>, {
                    variant: "success",
                    anchorOrigin: { horizontal: "left", vertical: "top" },
                  });

                  router.push("/");
                } else {
                  enqueueSnackbar(<small>Issue Creating Post</small>, {
                    variant: "error",
                    anchorOrigin: { horizontal: "left", vertical: "top" },
                  });
                }
              })
              .catch((err) => {
                setLoading(false);
                enqueueSnackbar(<small>Issue Creating Post</small>, {
                  variant: "error",
                  anchorOrigin: { horizontal: "left", vertical: "top" },
                });
              });
          }

          enqueueSnackbar(
            <small>
              No GeoLocation found, however we will still attempt to create your
              post although the location won't be accurate.
            </small>,
            {
              variant: "info",
              anchorOrigin: { horizontal: "left", vertical: "top" },
            }
          );
        }
      );
    } catch (err) {
      const post = new Post(
        process.env.BACKEND_URL,
        accountServices.access_token,
        {
          coordinates: {
            longitude: null,
            latitude: null,
          },
        }
      );

      if (router.query.share) {
        post
          .createAShare(content, router.query.share)
          .then((result) => {
            setLoading(false);
            if (result.status === 200) {
              enqueueSnackbar(<small>Post Shared</small>, {
                variant: "success",
                anchorOrigin: { horizontal: "left", vertical: "top" },
              });

              router.push("/");
            } else {
              enqueueSnackbar(<small>Issue Sharing Post</small>, {
                variant: "error",
                anchorOrigin: { horizontal: "left", vertical: "top" },
              });
            }
          })
          .catch((err) => {
            setLoading(false);
            enqueueSnackbar(<small>Issue Sharing Post</small>, {
              variant: "error",
              anchorOrigin: { horizontal: "left", vertical: "top" },
            });
          });
      } else if (router.query.reply) {
        post
          .createAReply(content, router.query.reply)
          .then((result) => {
            setLoading(false);
            if (result.status === 200) {
              enqueueSnackbar(<small>Responded To Post</small>, {
                variant: "success",
                anchorOrigin: { horizontal: "left", vertical: "top" },
              });

              router.push("/");
            } else {
              enqueueSnackbar(<small>Issue Responding To Post</small>, {
                variant: "error",
                anchorOrigin: { horizontal: "left", vertical: "top" },
              });
            }
          })
          .catch((err) => {
            setLoading(false);
            enqueueSnackbar(<small>Issue Responding To Post</small>, {
              variant: "error",
              anchorOrigin: { horizontal: "left", vertical: "top" },
            });
          });
      } else {
        post
          .create(content)
          .then((result) => {
            setLoading(false);
            if (result.status === 200) {
              enqueueSnackbar(<small>Post Created</small>, {
                variant: "success",
                anchorOrigin: { horizontal: "left", vertical: "top" },
              });

              router.push("/");
            } else {
              enqueueSnackbar(<small>Issue Creating Post</small>, {
                variant: "error",
                anchorOrigin: { horizontal: "left", vertical: "top" },
              });
            }
          })
          .catch((err) => {
            setLoading(false);
            enqueueSnackbar(<small>Issue Creating Post</small>, {
              variant: "error",
              anchorOrigin: { horizontal: "left", vertical: "top" },
            });
          });
      }
    }
  };

  return (
    <div>
      <Link href="/" passHref>
        <MdKeyboardBackspace className="mx-2" style={{ fontSize: "20px" }} />
      </Link>
      <div className="m-2">
        <div className={widget.secondary}>
          <div className="container-flush p-4">
            <div className="row">
              <div className="col-12 mb-3">
                {accountServices.displayProfileChip({ borderWidth: "0px" })}
              </div>
            </div>
            {router.query.reply && !router.query.share && (
              <div className="mb-3">
                <ChildWidget post_id={router.query.reply} />
              </div>
            )}
            <div className="row"></div>
            <textarea
              rows={`${rows}`}
              cols="20"
              wrap="hard"
              className={widget.text_input}
              style={{ height: "100%", width: "100%" }}
              placeholder="What are you thinking about?"
              type="textarea"
              name="content"
              onChange={(e) => {
                setContent(e.target.value);
              }}
              value={content}
            />
            {router.query.share && !router.query.reply && (
              <div>
                <ChildWidget post_id={router.query.share} />
              </div>
            )}
            <div className="row mt-3">
              <div className="col-12 text-end">
                <LoadingButton
                  variant="contained"
                  disabled={!showPostButton}
                  sx={{
                    borderRadius: "20px",
                    borderColor: "transparent",
                  }}
                  onClick={() => {
                    setLoading(true);
                    handleSubmit();
                  }}
                  disableElevation
                  loading={loading}
                >
                  {router.query.share ? (
                    <>Share</>
                  ) : (
                    <>{router.query.reply ? "Reply" : "Post"}</>
                  )}
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
