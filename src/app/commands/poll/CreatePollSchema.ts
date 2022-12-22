import * as joi from "joi";

export const CreatePollSchema = joi.object({
    pollId: joi.string().required(),
    numberOfQuestions: joi.number().required(),
})