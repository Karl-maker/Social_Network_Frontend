// Pre definded
import { useEffect, useState } from "react";
import util from "util";

import styles from "../styles/modules/Home.module.css";
import PostCollection from "../components/api/posts/PostCollection";
import PostListWidget from "../components/post/PostListWidget";
import { noDuplicateObjects } from "../components/utils/array";

export default function Home() {
  let post = new PostCollection(process.env.BACKEND_URL || "", "", {});
  const PAGE_SIZE = 2;
  const [posts, setPosts] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [maxDistance, setMaxDistance] = useState(10000);
  const [errorData, setErrorData] = useState();

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
        });
    });
  }, [pageNumber]);

  return (
    <>
      <PostListWidget posts={posts} />
      {/*

        When Scrolled To the end load more content

        */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setPageNumber((pageNumber += 1));
        }}
      />
    </>
  );
}
