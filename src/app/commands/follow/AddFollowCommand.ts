import joi from "joi";

export const AddFollowCommand = joi.object({
  addedBy: joi.string().required(),
  userId: joi.string().required(),
});
