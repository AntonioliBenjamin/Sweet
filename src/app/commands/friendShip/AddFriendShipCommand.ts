import joi from 'joi';

export const AddFriendShipCommand = joi.object({
    senderId: joi.string().required(),
    recipientId: joi.string().required(),
})