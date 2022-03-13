import { HiReply } from "react-icons/hi";
import { FiShare } from "react-icons/fi";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiFillLike,
  AiFillDislike,
} from "react-icons/ai";
import IconButton from "@mui/material/IconButton";
import { useState, useEffect } from "react";
import activityMachine from "../state-machine/activity";
import { useInterpret, useMachine, useActor } from "@xstate/react";

export default function ActivityWidget({
  likes,
  dislikes,
  replies,
  shares,
  post,
}) {
  const icons_style = { color: "#2d3436", fontSize: "20px" };
  const [like, setLike] = useState(likes || { amount: 0 });
  const [dislike, setDislike] = useState(dislikes || { amount: 0 });
  const [reply, setReply] = useState(replies || 0);
  const [share, setShare] = useState(shares || 0);
  const [prev, setPrev] = useState("initial");

  const activityService = useInterpret(activityMachine);
  const [activityState] = useActor(activityService);

  useEffect(() => {
    post.checkActivityStatus(post.data._id).then((result) => {
      if (!result.data) {
        return;
      }

      if (result.data.type === "like") {
        activityService.send("LIKE");
      } else if (result.data.type === "dislike") {
        activityService.send("DISLIKE");
      }
    });
  }, []);

  useEffect(() => {
    if (prev === "initial") {
      return;
    }

    if (prev === "like") {
      setLike({ amount: like.amount - 1 });
    } else if (prev === "dislike") {
      setDislike({ amount: dislike.amount - 1 });
    }

    if (activityState.value === "like") {
      setLike({ amount: like.amount + 1 });
    } else if (activityState.value === "dislike") {
      setDislike({ amount: dislike.amount + 1 });
    }
  }, [activityState.value]);

  return (
    <div className="row mt-2 p-2">
      <div className="col-12 d-flex justify-content-between align-item-center">
        {/*

      Activity

       */}
        <div>
          <IconButton aria-label="reply" color="primary" className="p-2">
            <HiReply style={icons_style} />
          </IconButton>
          <small>{reply && reply.amount}</small>
        </div>
        <div className={activityState.matches("like") && "primary-theme"}>
          <IconButton
            aria-label="like"
            color="success"
            className="p-2"
            onClick={(e) => {
              post.likeButtonInteraction().then((result) => {
                if (result.status === 200) {
                  setPrev(activityState.value);
                  activityService.send("LIKE");
                }
              });
            }}
          >
            <AiOutlineLike style={icons_style} />
          </IconButton>
          <small>{like.amount > 0 && like.amount}</small>
        </div>
        <div className={activityState.matches("dislike") && "primary-theme"}>
          <IconButton
            aria-label="dislike"
            color="secondary"
            className="p-2"
            onClick={(e) => {
              post.dislikeButtonInteraction().then((result) => {
                if (result.status === 200) {
                  setPrev(activityState.value);
                  activityService.send("DISLIKE");
                }
              });
            }}
          >
            <AiOutlineDislike style={icons_style} />
          </IconButton>
          <small>{dislike.amount > 0 && dislike.amount}</small>
        </div>
        <div>
          <IconButton aria-label="share" color="primary" className="p-2">
            <FiShare style={icons_style} />
          </IconButton>
          <small>{share && share.amount}</small>
        </div>
      </div>
    </div>
  );
}
