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

  return (
    <ul className="p-0 m-0">
      {/* set distance and have other options and info here such as current location*/}
      {listPosts}
    </ul>
  );
}
