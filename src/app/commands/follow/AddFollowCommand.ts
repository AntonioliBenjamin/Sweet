import joi from 'joi';

export const AddFollowCommand = joi.object({
    addedBy: joi.string().required(),
    userIdArray: joi.array().required(),
})