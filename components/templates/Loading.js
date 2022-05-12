import { CircularProgress, Backdrop } from "@mui/material";
import Image from "next/image";

/*

  Shows loading if loading is set to true

*/

export default function Loading({ children, loading }) {
  if (loading) {
    return (
      <Backdrop
        sx={{ color: "#ffff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <Image
          src="/logo(blue).svg"
          height={100}
          width={100}
          alt="Dripplie-Logo"
        />
      </Backdrop>
    );
  }

  return <>{children}</>;
}
