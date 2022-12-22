import { model, Schema } from "mongoose";
import { QuestionProperties } from "../../../../core/Entities/Question";

export type pollModel = {
  pollId: string;
  questions: Array<QuestionProperties>;
  createdAt: number;
};

const pollSchema = new Schema({
  pollId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  questions: [
    {
      questionId: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },
      description: {
        type: String,
        required: true,
      },
      picture: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Number,
    required: true,
  },
});

export const PollModel = model("polls", pollSchema);
