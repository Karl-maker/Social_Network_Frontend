import token from "../../../token/jwt";
import dbConnect from "../../../helper/db";
import Cors from "cors";
import middleware from "../../../middlewares";
import ProfileService from "../../../services/profile";
import jwt from "jsonwebtoken";
import config from "../../../config";
import ErrorHandler from "../../../middlewares/error-handling";

const cors = middleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    credentials: true,
  })
);

async function profile(req, res) {
  const ACCESS_TOKEN_PUBLIC_KEY = config.jwt.ACCESS_TOKEN_PUBLIC_KEY;
  await cors(req, res);

  if (req.method === "GET") {
    // Process a POST request
    try {
      await dbConnect();

      let access_token =
        req.headers["x-access-token"] || req.headers["authorization"];

      // Remove Bearer from string
      access_token = access_token.replace(/^Bearer\s+/, "");

      const payload = await jwt.verify(access_token, ACCESS_TOKEN_PUBLIC_KEY, {
        algorithm: [config.jwt.ALGORITHM],
      });

      if (!payload) {
        throw { name: "UnauthorizedError" };
      }

      const user = payload.user;

      const profile = await ProfileService.getOneById(user._id);

      res.status(200).json(profile);
    } catch (err) {
      ErrorHandler(err, res);
    }
  }
}

export default profile;
