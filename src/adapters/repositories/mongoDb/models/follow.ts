import { model, Schema } from "mongoose";

export type FollowModel = {
    id: string;
    senderId: string;
    recipientId: string;
}

const followSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique : true,
        index : true,
    },
    senderId: {
        type: String,
        required: true,   
    },
    recipientId: {
        type: String,
        required: true,
    }
})

export const FollowModel = model("follow", followSchema);