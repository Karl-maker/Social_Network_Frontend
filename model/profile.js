import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: [true, "User Id required"] },
    display_name: { type: String },
    bio: { type: String, default: "" },
    is_verified: { type: Boolean, default: 0 },
    private: { type: Boolean, default: 0 },
    /*

    Expected more attributes such as profile picture etc.

    */
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Profiles ||
  mongoose.model("Profiles", ProfileSchema);
