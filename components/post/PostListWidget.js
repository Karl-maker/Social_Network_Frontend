import { useEffect, useState } from "react";
import PostWidget from "./PostWidget";
import ReplyWidget from "./ReplyWidget";
import Link from "next/link";

export default function PostListWidget({ posts, type }) {
  const [list, setList] = useState([]);
  useEffect(() => {
    setList(posts);
  }, [posts]);

  const listPosts = list.map((post) => (
    <li key={post.data._id}>
      {type === "replies" && <ReplyWidget post={post} />}
      {!type && <PostWidget post={post} />}
    </li>
  ));

  return (
    <ul className="p-0 m-0">
      {/* set distance and have other options and info here such as current location*/}
      {listPosts}
    </ul>
  );
}
