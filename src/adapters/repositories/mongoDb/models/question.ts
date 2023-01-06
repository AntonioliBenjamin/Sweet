import { model, Schema } from "mongoose";

export type questionModel = {
  questionId: string;
  description: string;
  picture: string;
};

const questionSchema = new Schema({
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
});

export const QuestionModel = model("questions", questionSchema);
