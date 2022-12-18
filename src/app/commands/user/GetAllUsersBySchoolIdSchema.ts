import * as joi from "joi";

export const GetAllUsersBySchoolIdSchema = joi.object({
    schoolId: joi.string().required()
})