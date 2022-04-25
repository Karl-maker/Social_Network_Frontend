// Pre definded
import { useEffect, useState, useContext, useRef } from "react";
import util from "util";
import { Fab, Button, Slider, IconButton, Tooltip } from "@mui/material";
import { HiPencil } from "react-icons/hi";
import { RiEarthFill } from "react-icons/ri";
import Link from "next/link";
import { ImLocation2 } from "react-icons/im";
import PostSkeleton from "../components/post/PostSkeleton";
import styles from "../styles/modules/Home.module.css";
import PostCollection from "../components/api/posts/PostCollection";
import PostListWidget from "../components/post/PostListWidget";
import { noDuplicateObjects } from "../components/utils/array";
import {
  AccountContext,
  AlertContext,
} from "../components/templates/ContextProvider";
import DistanceSlider from "../components/post/DistanceSlider";
import widget from "../styles/modules/Widget.module.css";
import { MetersAndKilometers } from "../components/utils/distance";

export async function getStaticProps(context) {
  return {
    props: {
      protected: false,
      title: "View Post Around You",
    },
  };
}

export default function Home() {
  const accountServices = useContext(AccountContext);
  const alertServices = useContext(AlertContext);

  let post = new PostCollection(
    process.env.BACKEND_URL || "",
    accountServices.access_token || "",
    {}
  );
  const PAGE_SIZE = 10;
  const [posts, setPosts] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [maxDistance, setMaxDistance] = useState(5000);
  const [toggleLoad, setToggleLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionButton, setPermissionButton] = useState(false);
  const listInnerRef = useRef();

  const handleScroll = (e) => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

      if ((scrollHeight - scrollTop) * 0.9 <= clientHeight) {
        console.log("scroll load");
        setPageNumber(pageNumber + 1);
      }
    }
  };

  const setPostCoordinatesWithOutPermission = () => {
    post.coordinates = {
      latitude: 10.650488900252434,
      longitude: -61.51599120383046,
    };

    // Get many posts
    post
      .fetchManyPosts({
        page_number: pageNumber,
        page_size: PAGE_SIZE,
        max_distance: maxDistance,
      })
      .then(({ meta_data, data }) => {
        setPosts(noDuplicateObjects(posts.concat(data), "_id"));

        alertServices.setAlertInfo({
          severity: "warning",
          content:
            "Couldn't get geolocation, so we've loaded posts from Port of Spain, Trinidad and Tobago",
          title: "Change Of Plans",
        });

        alertServices.setAlert(true);
        setIsLoading(false);
      })
      .catch((error) => {
        // Capture Error
        alertServices.setAlertInfo({
          severity: "error",
          content: error.message,
          title: "Issue Occured",
        });
        alertServices.setAlert(true);
        setIsLoading(false);
      });
  };

  const setPostCoordinatesWithPermission = () => {
    navigator.geolocation.getCurrentPosition(
      (result) => {
        post.coordinates = {
          latitude: result.coords.latitude,
          longitude: result.coords.longitude,
        };

        // Get many posts
        post
          .fetchManyPosts({
            page_number: pageNumber,
            page_size: PAGE_SIZE,
            max_distance: maxDistance,
          })
          .then(({ meta_data, data }) => {
            setPosts(noDuplicateObjects(posts.concat(data), "_id"));
            setIsLoading(false);
          })
          .catch((error) => {
            // Capture Error

            setIsLoading(false);
          });
      },
      (error) => {
        // Failed To Get Location

        alertServices.setAlertInfo({
          severity: "error",
          content: error.message,
          title: "Issue Occured",
        });
        alertServices.setAlert(true);

        setPostCoordinatesWithOutPermission();
      }
    );
  };

  useEffect(() => {
    // Initially set Coordinates as such...

    if (posts.length < (pageNumber + 1) * PAGE_SIZE && posts.length !== 0) {
      setIsLoading(false);
      return;
    }

    try {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state == "granted") {
            setPostCoordinatesWithPermission();
          } else if (result.state == "prompt") {
            setPermissionButton(true);
          } else if (result.state == "denied") {
            alertServices.setAlertInfo({
              severity: "warning",
              content: "Denied Use Of Geolocation",
              title: "Geolocation",
            });
            alertServices.setAlert(true);

            setPostCoordinatesWithOutPermission();
          }
        });
    } catch (err) {
      setPostCoordinatesWithPermission();
    }
  }, [pageNumber, toggleLoad]);

  return (
    <div className={widget.list} onScroll={handleScroll} ref={listInnerRef}>
      <div className="mt-2 mb-2 px-5">
        <DistanceSlider
          maxDistance={maxDistance}
          setMaxDistance={setMaxDistance}
          sideElement={
            <Tooltip
              title="Refresh Posts"
              onClick={() => {
                setIsLoading(true);
                setPosts([]);
                setToggleLoad(!toggleLoad);
              }}
            >
              <IconButton aria-label="fingerprint" color="primary">
                <RiEarthFill />
              </IconButton>
            </Tooltip>
          }
        />
      </div>
      <p
        className="text-muted text-center"
        style={{ fontSize: "10px" }}
      >{`Search within ${MetersAndKilometers(maxDistance)}`}</p>
      <hr />
      {isLoading ? (
        <>
          <div className="container-flush p-4 text-center">
            {permissionButton && (
              <div className="col-12 text-center my-3">
                <Button
                  startIcon={<ImLocation2 />}
                  variant="outlined"
                  onClick={() => {
                    setPostCoordinatesWithPermission();
                  }}
                >
                  Get Post In Your Location
                </Button>
              </div>
            )}
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        </>
      ) : (
        <>
          {posts.length === 0 && !isLoading && (
            <div className={widget.secondary}>
              <Link
                href={accountServices.isLoggedIn ? "/post" : "/login"}
                passHref
              >
                <div className="container-flush p-4 text-center">
                  <p style={{ cursor: "pointer", fontSize: "15px" }}>
                    <strong>No Posts Found In Your Location</strong>
                  </p>
                  <p style={{ cursor: "pointer", fontSize: "11px" }}>
                    <small>Be the first to create a post here!</small>{" "}
                    <strong>Post Now</strong>
                  </p>
                </div>
              </Link>
            </div>
          )}

          <div style={{ paddingBottom: "130px" }}>
            <PostListWidget posts={posts} hr={true} />
          </div>

          {/*

        When Scrolled To the end load more content

        */}

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
        </>
      )}
    </div>
  );
}
