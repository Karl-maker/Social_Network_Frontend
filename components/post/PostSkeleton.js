import { Skeleton, Typography } from "@mui/material";

const PostSkeleton = () => {
  return (
    <>
      <div className=" p-0 row">
        <Skeleton width={30} sx={{ marginRight: "10px" }} />
        <Skeleton width={200} sx={{ margin: 0 }} />
      </div>
      <div className="p-0 row">
        <Skeleton sx={{ padding: "0", height: "100px" }} />
      </div>
    </>
  );
};

export function UserSkeleton() {
  return (
    <>
      <div className=" p-0 row">
        <Skeleton width={200} height={30} sx={{ margin: 0 }} />
      </div>
    </>
  );
}

export default PostSkeleton;
