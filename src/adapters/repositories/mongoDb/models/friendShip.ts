import { model, Schema } from "mongoose";

export type FriendShipModel = {
    id: string;
    senderId: string;
    recipientId: string;
}

const friendShipSchema = new Schema({
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

export const FriendShipModel = model("friendShip", friendShipSchema);