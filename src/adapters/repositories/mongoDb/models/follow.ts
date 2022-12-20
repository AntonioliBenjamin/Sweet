import { model, Schema } from "mongoose";

export type FollowModel = {
    id: string;
    addedBy: string;
    userId: string;
}

const followSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique : true,
        index : true,
    },
    addedBy: {
        type: String,
        required: true,   
    },
    userId: {
        type: String,
        required: true,
    }
})

export const FollowModel = model("follow", followSchema);