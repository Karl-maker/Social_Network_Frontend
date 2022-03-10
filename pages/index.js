// Pre definded
import { useEffect, useState } from "react";
import util from "util";

import styles from "../styles/modules/Home.module.css";
import PostCollection from "../components/api/posts/PostCollection";
import PostListWidget from "../components/post/PostListWidget";
import { noDuplicateObjects } from "../components/utils/array";

export default function Home() {
  let post = new PostCollection(process.env.BACKEND_URL || "", "", {});
  const [posts, setPosts] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

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
          page_size: 3,
          max_distance: 10,
        })
        .then(({ meta_data, data }) => {
          setPosts(noDuplicateObjects(posts.concat(data), "_id"));
        })
        .catch((error) => {
          // Capture Error
        });
    });
  }, [pageNumber]);

  return (
    <>
      <PostListWidget posts={posts} />
      <button
        onClick={(e) => {
          e.preventDefault();
          setPageNumber(pageNumber++);
          console.log(pageNumber);
        }}
      />
    </>
  );
}
