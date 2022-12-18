import * as joi from "joi";

export const ResetPasswordSchema = joi.object({
    email: joi.string().required(),
    token: joi.string().required(),
})