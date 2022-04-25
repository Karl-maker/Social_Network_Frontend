import mongoose from "mongoose";

const LoginSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    token: { type: String },
    user_type: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Logins || mongoose.model("Logins", LoginSchema);
