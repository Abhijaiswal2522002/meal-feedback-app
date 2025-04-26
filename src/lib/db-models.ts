import mongoose, { Schema, model, models } from "mongoose";

// User model
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    password: { type: String }, // optional for OAuth users
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);

// Meal model
const MealSchema = new Schema(
  {
    name: { type: String, required: true },
    date: { type: String, required: true },
    items: [{ type: String }],
    image: { type: String },
    description: { type: String },
    nutritionalInfo: {
      calories: { type: Number },
      protein: { type: String },
      carbs: { type: String },
      fat: { type: String },
    },
    averageRating: { type: Number, default: 0 },
    feedbackCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Meal = models.Meal || model("Meal", MealSchema);

// Feedback model
const FeedbackSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mealId: { type: mongoose.Schema.Types.ObjectId, ref: "Meal", required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Feedback = models.Feedback || model("Feedback", FeedbackSchema);
