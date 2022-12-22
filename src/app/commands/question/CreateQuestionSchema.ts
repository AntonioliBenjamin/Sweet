import joi from "joi";

export const CreateQuestionSchema = joi.object({
  description: joi.string().required(),
  picture: joi.string().required(),
});
