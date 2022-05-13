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

async function registration(req, res) {
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

      res.status(200).json({ user: user, message: "Registration Successful" });
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
export default registration;
