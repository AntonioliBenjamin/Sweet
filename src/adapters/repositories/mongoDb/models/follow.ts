import { model, Schema } from "mongoose";

export type FollowModel = {
  id: string;
  addedBy: string;
  userId: string;
};

const followSchema = new Schema({
  id: {
    type: String,
    required: true,
    index: true,
  },
  addedBy: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  }
});

export const FollowModel = model("follow", followSchema);
