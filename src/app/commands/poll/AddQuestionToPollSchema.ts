import joi from "joi";

export const AddQuestionToPollSchema = joi.object({
  pollId: joi.string().required(),
  questionId: joi.string().required(),
});
