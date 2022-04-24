import { Skeleton, Typography } from "@mui/material";

const PostSkeleton = () => {
  return (
    <>
      <div className="m-0 p-0 row">
        <Skeleton
          width={30}
          style={{ marginRight: "20px", borderRadius: "5px" }}
        />
        <Skeleton width={200} style={{ borderRadius: "5px" }} />
      </div>
      <div className="m-0 p-0 row">
        <Skeleton height={108} style={{ padding: "0", borderRadius: "15px" }} />
      </div>
    </>
  );
};

export default PostSkeleton;
