import mongoose, { models } from "mongoose";

const OtpSchema = new mongoose.Schema(
  {
    email: String,
    code: Number,
  },
  { timestamps: true }
);

export const Otp = models.Otp || mongoose.model("Otp", OtpSchema);
