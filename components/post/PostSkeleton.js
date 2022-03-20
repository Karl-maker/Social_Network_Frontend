import { Skeleton, Typography } from "@mui/material";

const PostSkeleton = () => {
  return (
    <>
      <div className="mt-2 row">
        <Skeleton width={30} style={{ marginRight: "20px" }} />
        <Skeleton width={200} />
      </div>
      <div className="mt-0 row">
        <Skeleton height={108} style={{ padding: "0" }} />
      </div>
    </>
  );
};

export default PostSkeleton;
