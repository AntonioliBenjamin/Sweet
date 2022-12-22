import joi from "joi";

export const DeleteFollowCommand = joi.object({
  id: joi.string().required(),
});
