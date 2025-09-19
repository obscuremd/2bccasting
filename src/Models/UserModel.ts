import mongoose, { Document } from "mongoose";

interface IUserDoc extends Document {
  email: string;
  password: string;
  profile_picture?: string;
  fullname: string;
  bio: string;
  gender: "male" | "female";
  location: string;
  category: "talent" | "scout";
  date_of_birth: Date;
  role?: string;
  saved_profiles: string[];
  portfolio_pictures?: string[];
  cv?: string;
  vip?: boolean;
}

const UserSchema = new mongoose.Schema<IUserDoc>(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    profile_picture: { type: String },
    fullname: { type: String, required: true },
    bio: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    location: { type: String, required: true },
    category: { type: String, enum: ["talent", "scout"], required: true },
    date_of_birth: { type: Date, required: true },
    saved_profiles: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],

    role: {
      type: String,
      required: function (this: IUserDoc) {
        return this.category === "talent";
      },
    },
    portfolio_pictures: {
      type: [String],
      required: function (this: IUserDoc) {
        return this.category === "talent";
      },
    },
    cv: {
      type: String,
      required: function (this: IUserDoc) {
        return this.category === "talent";
      },
    },
    vip: {
      type: Boolean,
      required: function (this: IUserDoc) {
        return this.category === "talent";
      },
    },
  },
  { timestamps: true }
);

export const User =
  mongoose.models.User || mongoose.model<IUserDoc>("User", UserSchema);
