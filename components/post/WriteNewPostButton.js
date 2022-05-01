export default function WriteNewPost() {
  return (
    <>
      {accountServices.isLoggedIn ? (
        <div className="d-lg-none">
          <Link href="/post" passHref>
            <Fab
              aria-label="create post"
              sx={{
                position: "absolute",
                bottom: 70,
                right: 16,
                backgroundColor: "#2980b9",
                color: "#ffff",
              }}
            >
              <HiPencil style={{ fontSize: "20px" }} />
            </Fab>
          </Link>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
