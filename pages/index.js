// Pre definded
import { useEffect, useState, useContext } from "react";
import util from "util";

import styles from "../styles/modules/Home.module.css";
import PostCollection from "../components/api/posts/PostCollection";
import PostListWidget from "../components/post/PostListWidget";
import { noDuplicateObjects } from "../components/utils/array";
import { AccountContext } from "../components/templates/ContextProvider";
import DistanceSlider from "../components/post/DistanceSlider";
import widget from "../styles/modules/PostWidget.module.css";

export async function getStaticProps(context) {
  return {
    props: {
      protected: false,
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
    <div className="mt-3">
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
    </div>
  );
}
