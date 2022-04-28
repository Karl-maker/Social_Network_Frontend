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

export default async function authenticate(req, res) {
  if (req.method === "POST") {
    try {
      await cors(req, res);

      await dbConnect();

      const { refresh_token } = parseCookies(req);

      const access_token = await token.getAccessTokenWithRefreshToken(
        refresh_token
      );

      res.status(200).json({
        access_token,
      });
    } catch (err) {
      res.status(500).json({ ...err });
    }
  }
}
