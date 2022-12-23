import joi from "joi";

export const DeleteQuestionSchema = joi.object({
  questionId: joi.string().required(),
});
