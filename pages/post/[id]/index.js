import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import widget from "../../../styles/modules/Widget.module.css";
import Connection from "../../../components/api/Connection";
import Post from "../../../components/api/posts/Post";
import PostSkeleton from "../../../components/post/PostSkeleton";
import PostWidget from "../../../components/post/PostWidget";
import RepliesList from "../../../components/post/RepliesList";
import { AccountContext } from "../../../components/templates/ContextProvider";

export async function getStaticProps(context) {
  return {
    props: {
      protected: false,
      title: "Post",
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [
      // String variant:
      "/post/id",
    ],
    fallback: true,
  };
}

export default function PostPage() {
  const router = useRouter();
  const accountServices = useContext(AccountContext);
  const [prompt, setPrompt] = useState("");
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
        })
        .catch((err) => {
          setPrompt("Unexpected Error");
        });
    }
  }, [router.query.id]);

  return prompt ? (
    <div className={widget.secondary}>
      <div className="text-center p-5">{prompt}</div>
    </div>
  ) : (
    <div className={widget.list}>
      {postInfo ? (
        <>
          <PostWidget post={postInfo} />
          {router.query.id && (
            <RepliesList className="mx-2" post_id={router.query.id} />
          )}
        </>
      ) : (
        <div className="container-flush p-4 text-center">
          <PostSkeleton />
        </div>
      )}
    </div>
  );
}
