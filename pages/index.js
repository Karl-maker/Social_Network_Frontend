import { useEffect, useState, useContext, useRef } from "react";
import {
  Fab,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { HiPencil } from "react-icons/hi";
import { RiEarthFill } from "react-icons/ri";
import { BsChevronCompactDown } from "react-icons/bs";
import Link from "next/link";
import { ImLocation2 } from "react-icons/im";
import PostSkeleton from "../components/post/PostSkeleton";
import PostListWidget from "../components/post/PostListWidget";
import PostCollection from "../components/api/posts/PostCollection";
import { noDuplicateObjects } from "../components/utils/array";
import { useSnackbar } from "notistack";
import { AccountContext } from "../components/templates/ContextProvider";
import DistanceSlider from "../components/post/DistanceSlider";
import widget from "../styles/modules/Widget.module.css";
import { MetersAndKilometers } from "../components/utils/distance";
import VisibilitySensor from "react-visibility-sensor";

/*
 * Page Title and Guard Status
 *
 * This allows us to protect each page. Home page is not protected but it has other aspects
 */

export async function getStaticProps(context) {
  return {
    props: {
      protected: false,
      title: "Syncviz",
      description: "View posts created by other users who are close by.",
    },
  };
}

export default function Home() {
  // Contexts

  const accountServices = useContext(AccountContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // Constants

  const PAGE_SIZE = 10;
  const LOCATIONS = [
    {
      location: "Port of Spain, Trinidad and Tobago",
      latitude: 10.650488900252434,
      longitude: -61.51599120383046,
    },
    {
      location: "New York City, United States of America",
      latitude: 40.73061,
      longitude: -73.935242,
    },
    {
      location: "Great Britain, United Kingdom",
      latitude: 53.826,
      longitude: -2.422,
    },
  ];

  // Objects

  const post_collection = new PostCollection(
    process.env.BACKEND_URL || "",
    accountServices.access_token || "",
    {}
  );

  // useState hooks
  const [buttonLoad, setButtonLoad] = useState(false);
  const [post] = useState(post_collection);
  const [status, setStatus] = useState(<></>);
  const [locationInfo, setLocationInfo] = useState("");
  const [posts, setPosts] = useState([]); // List to feed into post list widget
  const [isUsingCurrentPosition, setIsUsingCurrentPosition] = useState(true);
  const [pageNumber, setPageNumber] = useState(0); // Pagination starts at 0
  const [maxDistance, setMaxDistance] = useState(5000); // Distance to fetch data
  const [isLoading, setIsLoading] = useState(true); // Loading state to load page with skeleton
  const [permissionButton, setPermissionButton] = useState(false); // If given permission to use ask for use of geolocation a button would appear on true

  /*

  handleScroll checks if there is or should be more posts and increase the page number on scroll down

  */

  const LoadMorePrompt = () => {
    if (Number.isInteger(posts.length / PAGE_SIZE) && posts.length) {
      // Show Prompt to get more

      return (
        <VisibilitySensor
          delayedCall={true}
          intervalDelay={1000}
          onChange={(isVisible) => {
            if (isVisible) {
              setButtonLoad(true);
              setPageNumber(pageNumber + 1);
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

  const fetchPosts = () => {
    return post
      .fetchManyPosts({
        page_number: pageNumber,
        page_size: PAGE_SIZE,
        max_distance: maxDistance,
      })
      .then((result) => {
        if (result) {
          const { data } = result;
          setPosts(noDuplicateObjects(posts.concat(data), "_id"));
        } else {
          throw {
            message: <small>Unexpected Error. Please try again later.</small>,
          };
        }

        setIsLoading(false);
        setButtonLoad(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setButtonLoad(false);
        throw error;
      });
  };

  // On Mount

  useEffect(() => {
    (function () {
      try {
        navigator.permissions
          .query({ name: "geolocation" })
          .then(function (result) {
            if (result.state == "granted") {
              setStatus(
                <>
                  Be the first to place a thought here!{" "}
                  <Link href="/post">
                    <strong>Create a Post</strong>
                  </Link>
                </>
              );
              setPermissionButton(false);
              navigator.geolocation.getCurrentPosition(
                (results) => {
                  post.coordinates = {
                    latitude: results.coords.latitude,
                    longitude: results.coords.longitude,
                  };

                  try {
                    fetchPosts();
                  } catch (err) {
                    enqueueSnackbar(err.message, {
                      variant: "error",
                      anchorOrigin: { horizontal: "left", vertical: "top" },
                    });
                  }
                },
                (err) => {
                  enqueueSnackbar(err.message, {
                    variant: "error",
                    anchorOrigin: { horizontal: "left", vertical: "top" },
                  });
                }
              );
            } else if (result.state == "prompt") {
              setPermissionButton(true);
              setStatus(
                <>Allow location to start viewing and sharing thoughts</>
              );

              enqueueSnackbar(
                <small>
                  Select the <strong>GET POST IN YOUR LOCATION</strong> button
                  to load posts
                </small>,
                {
                  variant: "info",
                  anchorOrigin: { horizontal: "left", vertical: "top" },
                }
              );
            } else if (result.state == "denied") {
              setPermissionButton(false);

              post.coordinates = {
                latitude: null,
                longitude: null,
              };

              try {
                fetchPosts();
              } catch (err) {
                enqueueSnackbar(err.message, {
                  variant: "error",
                  anchorOrigin: { horizontal: "left", vertical: "top" },
                });
              }

              setStatus(
                <>
                  You can change your <strong>location settings</strong> to view
                  posts, or try the{" "}
                  <strong>
                    Geo-Randomizer <RiEarthFill />
                  </strong>
                </>
              );
              setIsLoading(false);
            }
          })
          .catch((err) => {
            enqueueSnackbar(err.message, {
              variant: "error",
              anchorOrigin: { horizontal: "left", vertical: "top" },
            });
          });
      } catch (err) {}
    })();
  }, []);

  // Issue:

  /*

  When using global randomizer it doesn't give the user's post class back current location

  */

  useEffect(() => {
    if (isUsingCurrentPosition) {
      try {
        navigator.geolocation.getCurrentPosition(
          (results) => {
            post.coordinates = {
              latitude: results.coords.latitude,
              longitude: results.coords.longitude,
            };

            try {
              fetchPosts();
            } catch (err) {
              enqueueSnackbar(err.message, {
                variant: "error",
                anchorOrigin: { horizontal: "left", vertical: "top" },
              });
            }
          },
          (err) => {
            post.coordinates = {
              latitude: null,
              longitude: null,
            };

            try {
              fetchPosts();
            } catch (err) {
              enqueueSnackbar(err.message, {
                variant: "error",
                anchorOrigin: { horizontal: "left", vertical: "top" },
              });
            }

            enqueueSnackbar(
              <small>
                Location would not be accurate since your location settings are{" "}
                <strong>turned off</strong>
              </small>,
              {
                variant: "info",
                anchorOrigin: { horizontal: "left", vertical: "top" },
              }
            );
          }
        );
      } catch (e) {
        post.coordinates = {
          latitude: null,
          longitude: null,
        };

        try {
          fetchPosts();
        } catch (err) {
          enqueueSnackbar(err.message, {
            variant: "error",
            anchorOrigin: { horizontal: "left", vertical: "top" },
          });
        }

        enqueueSnackbar(
          <small>
            Location would not be accurate since your location settings are{" "}
            <strong>turned off</strong>
          </small>,
          {
            variant: "info",
            anchorOrigin: { horizontal: "left", vertical: "top" },
          }
        );
      }
    } else {
      const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];

      post.coordinates = {
        latitude: location.latitude,
        longitude: location.longitude,
      };

      setLocationInfo(location.location);

      try {
        fetchPosts();
      } catch (err) {
        enqueueSnackbar(err.message, {
          variant: "error",
          anchorOrigin: { horizontal: "left", vertical: "top" },
        });
      }

      enqueueSnackbar(
        <small>
          Getting posts from <strong>{location.location}</strong> around a{" "}
          {MetersAndKilometers(maxDistance)} wide area
        </small>,
        {
          variant: "info",
          anchorOrigin: { horizontal: "left", vertical: "top" },
        }
      );
    }
  }, [isUsingCurrentPosition, pageNumber]);

  return (
    <div className={widget.list}>
      {
        // Slider
      }
      <div className="mt-2 mb-2 px-4">
        <DistanceSlider
          maxDistance={maxDistance}
          setMaxDistance={setMaxDistance}
          additionalAction={() => {
            setPageNumber(0);
            setIsLoading(true);
            setPosts([]);
            fetchPosts();
          }}
          sideElement={
            <Tooltip
              title={isUsingCurrentPosition ? "Randomize" : "Current Position"}
            >
              <IconButton
                aria-label="globe"
                sx={{ color: isUsingCurrentPosition ? "grey" : "#2980b9" }}
                onClick={() => {
                  /*

                  Clear viewing area and set if viewer should use current position or not

                  */
                  setPageNumber(0);
                  setIsLoading(true);
                  setPosts([]);
                  setIsUsingCurrentPosition(!isUsingCurrentPosition);
                }}
              >
                <RiEarthFill />
              </IconButton>
            </Tooltip>
          }
        />
      </div>
      {
        // Info on fetch
      }
      <p className="text-muted text-center" style={{ fontSize: "10px" }}>
        {isUsingCurrentPosition
          ? `Search within ${MetersAndKilometers(maxDistance)}`
          : `${locationInfo} within ${MetersAndKilometers(maxDistance)}`}
      </p>
      {
        // Main Page
      }
      {permissionButton && (
        <div className="col-12 text-center my-3">
          <Button
            startIcon={<ImLocation2 />}
            variant="outlined"
            onClick={() => {
              setPermissionButton(false);
              setPosts([]);
              fetchPosts();
            }}
          >
            Get Post In Your Location
          </Button>
        </div>
      )}
      {isLoading ? (
        <>
          {
            // Show loading
          }
          <div className="container-flush p-4 text-center">
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
          {posts.length === 0 && !isLoading && (
            <div className={widget.secondary}>
              <div className="container-flush p-4 text-center">
                <p style={{ cursor: "pointer", fontSize: "15px" }}>
                  <strong>No Posts Found Here</strong>
                </p>
                <p style={{ cursor: "pointer", fontSize: "11px" }}>
                  {isUsingCurrentPosition ? (
                    <>{status}</>
                  ) : (
                    <>
                      Someone is yet to populate here with thoughts and messages
                    </>
                  )}
                </p>
              </div>
            </div>
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
      {accountServices.isLoggedIn && (
        <div className="d-lg-none">
          <Link href="/post" passHref>
            <Fab
              aria-label="create post"
              sx={{
                position: "absolute",
                bottom: 70,
                right: 16,
                backgroundColor: "#2980b9",
                color: "#ffff",
              }}
            >
              <HiPencil style={{ fontSize: "20px" }} />
            </Fab>
          </Link>
        </div>
      )}
    </div>
  );
}
