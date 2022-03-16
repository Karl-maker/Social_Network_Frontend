import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Connection from "../../../components/api/Connection";

import Post from "../../../components/api/posts/Post";
import PostSkeleton from "../../../components/post/PostSkeleton";
import PostWidget from "../../../components/post/PostWidget";
import { AccountContext } from "../../../components/templates/ContextProvider";

export default function PostPage() {
  const router = useRouter();
  const accountServices = useContext(AccountContext);
  const [postInfo, setPostInfo] = useState(null);

  useEffect(() => {
    const connect = new Connection(
      process.env.BACKEND_URL,
      accountServices.access_token
    );

    if (router.query.id) {
      connect
        .fetchGetGeneral(`/api/post/${router.query.id}`, {}, {})
        .then((result) => {
          if (result.data.length !== 0) {
            setPostInfo(
              new Post(process.env.BACKEND_URL, accountServices.access_token, {
                data: result.data[0],
              })
            );
          } else {
            router.push({ url: "/" });
          }
        });
    }
  }, [router.query.id]);

  return (
    <>
      {postInfo ? (
        <PostWidget post={postInfo} />
      ) : (
        <div className="container-flush p-4 text-center">
          <PostSkeleton />
        </div>
      )}
    </>
  );
}
