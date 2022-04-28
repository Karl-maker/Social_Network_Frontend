import dbConnect from "../../../helper/db";
import token from "../../../token/jwt";
import Cors from "cors";
import middleware from "../../../middlewares";
import { parseCookies } from "../../../middlewares/cookie";

const cors = middleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    credentials: true,
  })
);

export default async function logout(req, res) {
  await cors(req, res);
  // Login User and Send Cookies
  if (req.method === "DELETE") {
    await cors(req, res);

    await dbConnect();
    token
      .deleteRefreshToken(parseCookies(req).refresh_token)
      .then(() => {
        res.status(200).json({
          message: "User logged out",
        });
      })
      .catch((err) => {
        res.status(500).json({
          err,
        });
      });
  }
}
