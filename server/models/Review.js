import mongoose from "mongoose";

const { Schema } = mongoose;

const RatingsSchema = new Schema(
  {
    communication: { type: Number, min: 1, max: 5 },
    cost: { type: Number, min: 1, max: 5 },
    recovery: { type: Number, min: 1, max: 5 },
    waitingTime: { type: Number, min: 1, max: 5 },
    staffBehavior: { type: Number, min: 1, max: 5 },
  },
  { _id: false }
);

const ReviewSchema = new Schema(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientId: { type: Schema.Types.ObjectId, ref: "AuthUser", default: null },
    anonymous: { type: Boolean, default: false },
    verifiedPatient: { type: Boolean, default: false },
    ratings: { type: RatingsSchema, required: true },
    recommend: { type: Boolean, default: false },
    text: { type: String, default: "" },
    billUrl: { type: String, default: "" },
    reviewSource: {
      type: String,
      enum: ["web", "mobile", "email", "other"],
      default: "web",
    },
    fraudScore: { type: Number, default: 0 },
    response: {
      text: { type: String },
      responderId: { type: Schema.Types.ObjectId, ref: "AuthUser" },
      createdAt: { type: Date },
    },
    flags: [{ type: String }],
    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  { timestamps: true }
);

// compound index to help detect duplicates
ReviewSchema.index({ doctorId: 1, patientId: 1 });

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
