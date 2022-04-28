import { cookies } from "../../../middlewares/cookie";
import auth from "../../../services/auth";
import token from "../../../token/jwt";
import dbConnect from "../../../helper/db";
import loginModel from "../../../model/logins";
import Cors from "cors";
import middleware from "../../../middlewares";

const cors = middleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    credentials: true,
  })
);

async function login(req, res) {
  await cors(req, res);
  // Login User and Send Cookies
  if (req.method === "POST") {
    // Process a POST request
    try {
      await dbConnect();

      const credentials = req.body;

      const user = await auth.login(credentials);

      // Successful

      let refresh_token = await token.createRefreshToken(user);
      let access_token = await token.createAccessToken(user);

      if ((await loginModel.find({ user_id: user._id }).count()) > 4) {
        await loginModel.findOneAndDelete().sort({ createdAt: 1 });
      }

      await loginModel.create({
        user_id: user._id,
        token: refresh_token,
      });

      res.cookie("refresh_token", refresh_token, {
        secure: false,
        httpOnly: true,
        expire: 400000 + Date.now(),
        path: `/api/auth/authenticate`,
      });

      //   res.getHeader("Set-Cookie");
      res.status(200).json({ access_token });
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ message: error.message || "Unexpected Error" });
    }
  }
}

export default cookies(login);
