// Pre definded
import { useEffect, useState } from "react";
import util from "util";

import styles from "../styles/modules/Home.module.css";
import PostCollection from "../components/api/posts/PostCollection";
import PostListWidget from "../components/post/PostListWidget";

export default function Home() {
  let post = new PostCollection("http://localhost:5000", "", {});
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Initially set Coordinates as such...

    navigator.geolocation.getCurrentPosition((result) => {
      post.coordinates = {
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
      };

      // Get many posts
      post
        .fetchManyPosts({ page_number: 0, page_size: 10, max_distance: 10 })
        .then(({ meta_data, data }) => {
          setPosts(data);
        })
        .catch((error) => {
          // Capture Error
        });
    });
  }, []);

  return (
    <>
      <PostListWidget posts={posts} />
    </>
  );
}
