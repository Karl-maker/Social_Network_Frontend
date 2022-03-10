import { useEffect, useState } from "react";
import PostWidget from "./PostWidget";

export default function PostListWidget({ posts }) {
  const [list, setList] = useState([]);
  useEffect(() => {
    setList(posts);
  }, [posts]);

  const listPosts = list.map((post) => (
    <li key={post.data._id}>
      <PostWidget post={post} />
    </li>
  ));

  return <>{listPosts}</>;
}
