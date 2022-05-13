import { cookies } from "../../../middlewares/cookie";
import User from "../../../model/user";
import token from "../../../token/jwt";
import dbConnect from "../../../helper/db";
import loginModel from "../../../model/logins";
import Cors from "cors";
import middleware from "../../../middlewares";
import {
  handleDuplicateKeyError,
  handleValidationError,
} from "../../../util/error-formatter";

const cors = middleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    credentials: true,
  })
);

async function register(req, res) {
  await cors(req, res);
  // Login User and Send Cookies
  if (req.method === "POST") {
    // Process a POST request
    try {
      await dbConnect();

      const { email, password } = req.body;

      const user = await User.create({
        email: email.toLowerCase(),
        password,
      });

      await UserService.sendConfirmationEmail(user.email);
    } catch (err) {
      // Error handle

      try {
        switch (true) {
          case err.name === "ValidationError":
            //400 Errors
            return handleValidationError(err, res);

          case err.code && err.code == 11000:
            return handleDuplicateKeyError(err, res);
          default:
            return res.status(500).json({ message: "Unexpected Error" });
        }
      } catch (e) {
        return res.status(500).json({ message: "Unexpected Error" });
      }
    }
  }
}
export default register;
