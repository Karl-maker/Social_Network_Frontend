import User from "../../../model/user";
import token from "../../../token/jwt";
import dbConnect from "../../../helper/db";
import loginModel from "../../../model/logins";
import Cors from "cors";
import middleware from "../../../middlewares";
import ErrorHandler from "../../../middlewares/error-handling";

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

      ErrorHandler(err, res);
    }
  }
}
export default registration;
