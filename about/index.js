import { Avatar, Grid, Chip, Typography } from "@mui/material";
import Image from "next/image";

export default function AboutMe() {
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
      columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}
    >
      <Grid item xs={4} sm={8} md={12} lg={12}>
        <Avatar
          sx={{
            width: 100,
            height: 100,
            margin: "20px",
          }}
          src={"/karl-johan-bailey.jpg"}
        ></Avatar>
      </Grid>

      <Grid item xs={4} sm={8} md={12} lg={12}>
        <Typography variant="h5" component="h2">
          Karl-Johan Bailey
        </Typography>
      </Grid>
      <Grid item xs={4} sm={8} md={12} lg={12}>
        <Typography
          variant="subtitle1"
          sx={{ textAlign: "center", margin: "20px" }}
        >
          Dripplie is a location based social media platform. This website
          allows users to view posts within their location using GeoLocation or
          IP addresses. Using MongoDB, Node.js, Express.js, React.js and
          Next.js, users are able to register, login, logout, post and interact
          with posts.
        </Typography>
      </Grid>
    </Grid>
  );
}
