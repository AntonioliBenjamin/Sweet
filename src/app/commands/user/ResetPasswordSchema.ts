import * as joi from "joi";

export const ResetPasswordSchema = joi.object({
    password: joi.string().required(),
    token: joi.string().required(),
})