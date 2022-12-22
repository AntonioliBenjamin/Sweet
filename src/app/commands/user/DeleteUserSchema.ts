import joi from "joi";

export const DeleteUserSchema = joi.object({
  id: joi.string().required(),
});
