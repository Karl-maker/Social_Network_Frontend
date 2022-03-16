import { AccountContext } from "../../components/templates/ContextProvider";
import Post from "../../components/api/posts/Post";
import widget from "../../styles/modules/Widget.module.css";
import ChildWidget from "../../components/post/ChildWidget";

import { useContext, useEffect, useState } from "react";
import { ImLocation2 } from "react-icons/im";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";

export async function getStaticProps(context) {
  return {
    props: {
      protected: true,
    },
  };
}

export default function CreatePost() {
  const accountServices = useContext(AccountContext);
  const [content, setContent] = useState("");
  const [rows, setRows] = useState(5);
  const router = useRouter();

  useEffect(() => {
    if (router.query.share) {
      setRows(3);
    } else if (router.query.reply) {
      setRows(2);
    }
  });

  const handleSubmit = (e) => {
    let coordinates = { latitude: null, longitude: null };

    navigator.geolocation.getCurrentPosition((result) => {
      const { latitude, longitude } = result.coords;

      coordinates.latitude = latitude;
      coordinates.longitude = longitude;

      const post = new Post(
        process.env.BACKEND_URL,
        accountServices.access_token,
        { coordinates }
      );

      if (router.query.share) {
        post.createAShare(content, router.query.share).then((result) => {
          if (result.status === 200) {
            router.push("/");
          }
        });
      } else if (router.query.reply) {
        post.createAReply(content, router.query.reply).then((result) => {
          if (result.status === 200) {
            router.push("/");
          }
        });
      } else {
        post.create(content).then((result) => {
          if (result.status === 200) {
            router.push("/");
          }
        });
      }
    });
  };

  return (
    <div className={widget.primary}>
      <div className="container-flush p-4">
        <div className="row">
          <div className="col-12">
            <p style={{ cursor: "pointer" }}>
              <small>
                <strong>{accountServices.display_name}</strong>
              </small>
              <small style={{ marginLeft: "5px" }}>{`@${
                accountServices.username || ""
              }`}</small>
            </p>
          </div>
        </div>
        {router.query.reply && !router.query.share && (
          <div className="mb-3">
            <ChildWidget post_id={router.query.reply} />
          </div>
        )}
        <div className="row"></div>
        <textarea
          rows={`${rows}`}
          cols="20"
          wrap="hard"
          className={widget.text_input}
          style={{ height: "100%", width: "100%" }}
          placeholder="What are you thinking about?"
          type="textarea"
          name="content"
          onChange={(e) => {
            setContent(e.target.value);
          }}
          value={content}
        />
        {router.query.share && !router.query.reply && (
          <div>
            <ChildWidget post_id={router.query.share} />
          </div>
        )}
        <div className="row mt-3">
          <div className="col-12 text-end">
            <Button
              variant="contained"
              sx={{
                borderRadius: "20px",
                borderColor: "transparent",
              }}
              onClick={handleSubmit}
              disableElevation
            >
              {router.query.share ? (
                "Share"
              ) : (
                <>{router.query.reply ? "Reply" : "Post"}</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
