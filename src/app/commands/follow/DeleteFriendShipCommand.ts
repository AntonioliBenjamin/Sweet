import joi from 'joi';

export const DeleteFriendShipCommand = joi.object({
    id: joi.string().required(),
})