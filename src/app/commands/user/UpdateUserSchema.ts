import joi from "joi";
import {Gender} from "../../../core/Entities/User";

export const UpdateUserSchema = joi.object({
    userName: joi.string().required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    section: joi.string().required(),
    schoolId: joi.string().required(),
    gender: joi
        .string()
        .valid(...Object.values(Gender))
        .required(),
})