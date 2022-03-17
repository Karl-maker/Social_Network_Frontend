// Pre definded
import { useEffect, useState, useContext, useRef } from "react";
import util from "util";
import { Fab } from "@mui/material";
import { HiPencil } from "react-icons/hi";
import Link from "next/link";

import PostSkeleton from "../components/post/PostSkeleton";
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
  const listInnerRef = useRef();

  const handleScroll = (e) => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

      if ((scrollHeight - scrollTop) * 0.9 <= clientHeight) {
        setPageNumber(pageNumber + 1);
      }
    }
  };

  useEffect(() => {
    // Initially set Coordinates as such...

    navigator.geolocation.getCurrentPosition((result) => {
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
    });
  }, [pageNumber]);

  if (isLoading) {
    return (
      <div className="container-flush p-4 text-center">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  return (
    <div className={widget.list} onScroll={handleScroll} ref={listInnerRef}>
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
      <PostListWidget posts={posts} />
      {/*

        When Scrolled To the end load more content

        */}

      {accountServices.isLoggedIn && (
        <Link href="/post" passHref>
          <Fab
            aria-label="create post"
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
              backgroundColor: "#2980b9",
              color: "#ffff",
            }}
          >
            <HiPencil style={{ fontSize: "20px" }} />
          </Fab>
        </Link>
      )}
    </div>
  );
}
