import { checkHowManyDaysAgo } from "../utils/date";

export default function PostWidget({ post }) {
  const post_date = new Date(post.data.createdAt);
  const current_date = new Date();
  return (
    <>
      <h5>{post.data.content}</h5>
      <p>{checkHowManyDaysAgo(post_date, current_date)}</p>
    </>
  );
}
