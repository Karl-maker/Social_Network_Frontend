import { useEffect, useState } from "react";
import PostWidget from "./PostWidget";
import ReplyWidget from "./ReplyWidget";
import Link from "next/link";

export default function PostListWidget({ posts, type, hr }) {
  const [list, setList] = useState([]);
  useEffect(() => {
    setList(posts);
  }, [posts]);

  const listPosts = list.map((post) => (
    <>
      <li key={post.data._id}>
        {type === "replies" && (
          <div className="mt-2">
            <ReplyWidget post={post} />
          </div>
        )}
        {!type && <PostWidget post={post} hr={hr} />}
      </li>
    </>
  ));

  return (
    <ul className="p-0 mb-5">
      {/* set distance and have other options and info here such as current location*/}
      {listPosts}
    </ul>
  );
}
