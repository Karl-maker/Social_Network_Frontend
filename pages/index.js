import { useEffect, useState, useContext, useRef } from "react";
import { Fab, Button, IconButton, Tooltip } from "@mui/material";
import { HiPencil } from "react-icons/hi";
import { RiEarthFill } from "react-icons/ri";
import Link from "next/link";
import { ImLocation2 } from "react-icons/im";
import PostSkeleton from "../components/post/PostSkeleton";
import PostListWidget from "../components/post/PostListWidget";
import PostCollection from "../components/api/posts/PostCollection";
import { noDuplicateObjects } from "../components/utils/array";
import {
  AccountContext,
  AlertContext,
} from "../components/templates/ContextProvider";
import DistanceSlider from "../components/post/DistanceSlider";
import widget from "../styles/modules/Widget.module.css";
import { MetersAndKilometers } from "../components/utils/distance";

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
  const alertServices = useContext(AlertContext);

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

  const [post] = useState(post_collection);
  const [status, setStatus] = useState(<></>);
  const [locationInfo, setLocationInfo] = useState("");
  const [posts, setPosts] = useState([]); // List to feed into post list widget
  const [isUsingCurrentPosition, setIsUsingCurrentPosition] = useState(true);
  const [pageNumber, setPageNumber] = useState(0); // Pagination starts at 0
  const [maxDistance, setMaxDistance] = useState(5000); // Distance to fetch data
  const [isLoading, setIsLoading] = useState(true); // Loading state to load page with skeleton
  const [permissionButton, setPermissionButton] = useState(false); // If given permission to use ask for use of geolocation a button would appear on true

  const listInnerRef = useRef();

  /*

  handleScroll checks if there is or should be more posts and increase the page number on scroll down

  */

  const handleScroll = (e) => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

      if (
        (scrollHeight - scrollTop) * 0.9 <= clientHeight &&
        Number.isInteger(posts.length / PAGE_SIZE)
      ) {
        setPageNumber(pageNumber + 1);
        fetchPosts();
      }
    }
  };

  const fetchPosts = () => {
    post
      .fetchManyPosts({
        page_number: pageNumber,
        page_size: PAGE_SIZE,
        max_distance: maxDistance,
      })
      .then(({ data }) => {
        setPosts(noDuplicateObjects(posts.concat(data), "_id"));
        setIsLoading(false);
      })
      .catch((error) => {
        alertServices.setAlertInfo({
          severity: "error",
          content: (
            <>
              Cannot load posts located here at the moment.{" "}
              <strong>
                Try the Geo-Randomizer <RiEarthFill />
              </strong>
            </>
          ),
          title: "Issue Getting Posts",
        });
        alertServices.setAlert(true);
        setIsLoading(false);
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

                  fetchPosts();
                },
                (err) => {
                  alertServices.setAlertInfo({
                    severity: "error",
                    content: err.message,
                    title: "Issue Getting GeoLocation",
                  });
                  alertServices.setAlert(true);
                }
              );
            } else if (result.state == "prompt") {
              setPermissionButton(true);
              setStatus(
                <>Allow location to start viewing and sharing thoughts</>
              );
              alertServices.setAlertInfo({
                severity: "info",
                content: (
                  <>
                    Select the <strong>GET POST IN YOUR LOCATION</strong> button
                    to load posts
                  </>
                ),
                title: "GeoLocation Option",
                vertical: "bottom",
              });
              alertServices.setAlert(true);
            } else if (result.state == "denied") {
              setPermissionButton(false);
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
              alertServices.setAlertInfo({
                duration: 10000,
                severity: "info",
                content: (
                  <>
                    We could not get posts within your area because your
                    location is <strong>turned off</strong>
                  </>
                ),
                title: (
                  <>
                    GeoLocation <strong>Not Found</strong>
                  </>
                ),
                vertical: "bottom",
              });
              alertServices.setAlert(true);
            }
          })
          .catch((err) => {
            alertServices.setAlertInfo({
              severity: "error",
              content: err.message,
              title: "Issue Occured",
            });
            alertServices.setAlert(true);
          });
      } catch (err) {}
    })();
  }, []);

  useEffect(() => {
    if (isUsingCurrentPosition) {
      try {
        navigator.geolocation.getCurrentPosition(
          (results) => {
            post.coordinates = {
              latitude: results.coords.latitude,
              longitude: results.coords.longitude,
            };

            fetchPosts();
          },
          (err) => {
            alertServices.setAlertInfo({
              severity: "error",
              content: err.message,
              title: "Issue Getting GeoLocation",
            });
            alertServices.setAlert(true);
          }
        );
      } catch (e) {}
    } else {
      const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];

      post.coordinates = {
        latitude: location.latitude,
        longitude: location.longitude,
      };

      setLocationInfo(location.location);

      fetchPosts();

      alertServices.setAlertInfo({
        severity: "info",
        content: `Getting posts from ${
          location.location
        } around a ${MetersAndKilometers(maxDistance)} wide area`,
        title: "Geo-Randomize",
        vertical: "bottom",
      });
      alertServices.setAlert(true);
    }
  }, [isUsingCurrentPosition]);

  return (
    <div className={widget.list} onScroll={handleScroll} ref={listInnerRef}>
      {
        // Slider
      }
      <div className="mt-2 mb-2 px-4">
        <DistanceSlider
          maxDistance={maxDistance}
          setMaxDistance={setMaxDistance}
          additionalAction={() => {
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
