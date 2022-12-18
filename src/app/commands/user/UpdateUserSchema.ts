import * as joi from "joi";

export const UpdateUserSchema = joi.object({
    userName: joi.string().required(),
    age: joi.number().required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    section: joi.string().required(),
})