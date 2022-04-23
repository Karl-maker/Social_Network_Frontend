// Pre definded
import { useEffect, useState, useContext, useRef } from "react";
import util from "util";
import { Fab, Button } from "@mui/material";
import { HiPencil } from "react-icons/hi";
import Link from "next/link";
import { ImLocation2 } from "react-icons/im";

import PostSkeleton from "../components/post/PostSkeleton";
import AlertWidget from "../components/templates/Alert";
import styles from "../styles/modules/Home.module.css";
import PostCollection from "../components/api/posts/PostCollection";
import PostListWidget from "../components/post/PostListWidget";
import { noDuplicateObjects } from "../components/utils/array";
import { AccountContext } from "../components/templates/ContextProvider";
import DistanceSlider from "../components/post/DistanceSlider";
import widget from "../styles/modules/Widget.module.css";

export async function getStaticProps(context) {
  return {
    props: {
      protected: false,
      title: "Feed",
    },
  };
}

export default function Home() {
  const accountServices = useContext(AccountContext);

  let post = new PostCollection(
    process.env.BACKEND_URL || "",
    accountServices.access_token || "",
    {}
  );
  const PAGE_SIZE = 10;
  const [posts, setPosts] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [maxDistance, setMaxDistance] = useState(50000);
  const [errorData, setErrorData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [permissionButton, setPermissionButton] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({});
  const listInnerRef = useRef();

  const handleScroll = (e) => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

      if ((scrollHeight - scrollTop) * 0.9 <= clientHeight) {
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
      })
      .catch((error) => {
        // Capture Error
        setErrorData(error);
        setIsLoading(false);
      });

    setIsLoading(false);
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
          })
          .catch((error) => {
            // Capture Error
            setErrorData(error);
            setIsLoading(false);
          });

        setIsLoading(false);
      },
      (error) => {
        // Failed To Get Location

        setAlertMessage({
          severity: "error",
          content: "Issue Getting Geolocation",
          title: "Geolocation",
        });
        setAlert(true);

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
            setAlertMessage({
              severity: "warning",
              content: "Denied Use Of Geolocation",
              title: "Geolocation",
            });
            setAlert(true);

            setPostCoordinatesWithOutPermission();
          }
        });
    } catch (err) {
      setAlertMessage({
        severity: "error",
        content: "Issue Getting Geolocation",
        title: "Geolocation",
      });
      setAlert(true);

      setPostCoordinatesWithOutPermission();
    }
  }, [pageNumber, maxDistance]);

  if (isLoading) {
    return (
      <div className="container-flush p-4 text-center">
        <AlertWidget
          severity={alertMessage.severity}
          content={alertMessage.content}
          title={alertMessage.severity}
          open={alert}
          setOpen={setAlert}
        />
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
    );
  }

  return (
    <div className={widget.list} onScroll={handleScroll} ref={listInnerRef}>
      <AlertWidget
        severity={alertMessage.severity}
        content={alertMessage.content}
        title={alertMessage.severity}
        open={alert}
        setOpen={setAlert}
      />
      {posts.length === 0 && !isLoading && (
        <div className={widget.secondary}>
          <Link href="/post" passHref>
            <div className="container-flush p-4 text-center">
              <p style={{ cursor: "pointer", fontSize: "15px" }}>
                <strong>No Posts Found In Your Location</strong>
              </p>
              <p style={{ cursor: "pointer", fontSize: "11px" }}>
                <small>Be the first to create a post here!</small>
              </p>
            </div>
          </Link>
        </div>
      )}
      <PostListWidget posts={posts} hr={true} />
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
    </div>
  );
}
