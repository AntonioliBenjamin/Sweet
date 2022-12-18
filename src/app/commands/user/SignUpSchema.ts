import * as joi from "joi";
import {Gender} from "../../../core/Entities/User";

export const SignUpSchema = joi.object({
    userName: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
    age: joi.number().required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    schoolId: joi.string().required(),
    section: joi.string().required(),
    gender: joi.string().valid(...Object.values(Gender)).required(),
})