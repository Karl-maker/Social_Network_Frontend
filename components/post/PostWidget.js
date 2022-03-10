export default function PostWidget({ post }) {
  return (
    <>
      <h5>{post.data.content}</h5>
      <p>{post.data.area.city}</p>
    </>
  );
}
