import mongoose from "mongoose";

const FlyerSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    flyer_image: { type: String },
    company_name: { type: String, required: true },
    profession: { type: String, required: true },
    skills: { type: String, required: true },
    education: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    location: { type: String, required: true },

    project_begin: { type: Date, required: true },
    project_end: { type: Date, required: true },

    amount: { type: String },
    description: { type: String, default: [] },
  },
  { timestamps: true }
);

export const Flyer =
  mongoose.models.Flyer || mongoose.model("Flyer", FlyerSchema);
