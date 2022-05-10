import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "../config";

const saltOrRounds = config.bcrypt.SALTORROUNDS;

//const

const MIN_PASSWORD = 5;
const MIN_USERNAME = 5;
const MAX_USERNAME = 20;

//--------------------------------------------------------------------------------

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please use a valid email address",
      ],
      trim: true,
      index: true,
    },
    username: {
      type: String,
      minlength: [
        MIN_USERNAME,
        `Username must be longer than ${MIN_USERNAME} characters`,
      ],
      maxlength: [
        MAX_USERNAME,
        `Username must be shorter than ${MAX_USERNAME} characters`,
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [
        MIN_PASSWORD,
        `Password must be longer than ${MIN_PASSWORD} characters`,
      ],
      select: 0,
    },
    is_confirmed: { type: Boolean, default: 0 },
    account_type: { type: String },
    confirm_account_token: { type: String },
    reset_password_token: { type: String },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  let encrypted_password = await bcrypt.hash(this.password, saltOrRounds);
  this.password = encrypted_password;
  next();
});

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;

  let isValid = await bcrypt.compare(password, this.password);

  return isValid;
};

export default mongoose.models.Users || mongoose.model("Users", UserSchema);
