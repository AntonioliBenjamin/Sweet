import joi from "joi";

export const RecoverySchema = joi.object({
  email: joi.string().required(),
});
