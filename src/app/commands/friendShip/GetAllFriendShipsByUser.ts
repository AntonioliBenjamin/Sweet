import joi from 'joi';

export const GetAllUserBySchoolSchema = ({
    params: {
        userId: joi.string().required()
    }
})