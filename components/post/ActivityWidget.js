import { HiReply } from "react-icons/hi";
import { FiShare } from "react-icons/fi";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiFillLike,
  AiFillDislike,
} from "react-icons/ai";
import IconButton from "@mui/material/IconButton";

export default function ActivityWidget() {
  const icons_style = { color: "#2d3436", fontSize: "20px" };

  return (
    <div className="row mt-2 p-2">
      <div className="col-12 d-flex justify-content-between align-item-center">
        {/*

      Activity

       */}
        <IconButton aria-label="fingerprint" color="primary" className="p-2">
          <HiReply style={icons_style} />
        </IconButton>
        <IconButton aria-label="fingerprint" color="success" className="p-2">
          <AiOutlineLike style={icons_style} />
        </IconButton>
        <IconButton aria-label="fingerprint" color="secondary" className="p-2">
          <AiOutlineDislike style={icons_style} />
        </IconButton>
        <IconButton aria-label="fingerprint" color="primary" className="p-2">
          <FiShare style={icons_style} />
        </IconButton>
      </div>
    </div>
  );
}
