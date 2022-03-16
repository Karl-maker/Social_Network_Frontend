import { Skeleton, Typography } from "@mui/material";

const PostSkeleton = () => {
  return (
    <div className="mt-2">
      <Skeleton />
      <Typography variant="h1">
        <Skeleton />
      </Typography>
    </div>
  );
};

export default PostSkeleton;
