import PostCollection from "../../components/api/posts/PostCollection";
import { AccountContext } from "../../components/templates/ContextProvider";
import { noDuplicateObjects } from "../../components/utils/array";

import { useContext, useEffect, useState } from "react";
import PostSkeleton from "./PostSkeleton";
import PostListWidget from "./PostListWidget";

export default function RepliesList({ post_id }) {
  const PAGE_SIZE = 10;
  const accountServices = useContext(AccountContext);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [errorData, setErrorData] = useState();
  const [replies, setReplies] = useState([]);

  const post_collection = new PostCollection(
    process.env.BACKEND_URL,
    accountServices.access_token,
    {}
  );

  useEffect(() => {
    // Initially set Coordinates as such...

    navigator.geolocation.getCurrentPosition((result) => {
      post_collection.coordinates = {
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
      };

      // Get many posts
      post_collection
        .fetchReplies(post_id, {
          page_number: pageNumber,
          page_size: PAGE_SIZE,
        })
        .then(({ data }) => {
          setReplies(noDuplicateObjects(replies.concat(data), "_id"));
        })
        .catch((error) => {
          // Capture Error
          setErrorData("Issue Getting Responses");
          setLoading(false);
        });

      setLoading(false);
    });
  }, [pageNumber]);

  if (loading) {
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
    <>
      {replies.length > 0 ? (
        <PostListWidget posts={replies} type="replies" />
      ) : (
        <></>
      )}
    </>
  );
}
