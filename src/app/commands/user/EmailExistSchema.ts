import joi from "joi";

export const EmailExistSchema = joi.object({
  email: joi.string().email().required()
});
