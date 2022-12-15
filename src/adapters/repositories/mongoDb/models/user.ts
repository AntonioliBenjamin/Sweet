import {Gender} from './../../../../core/Entities/User';
import {model, Schema} from "mongoose";

export type userModel = {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    age: number;
    schoolId: string;
    section: string;
    gender: Gender;
    createdAt: number;
    updatedAt?: number;
    recoveryCode?: string
};

const userSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique : true,
        index : true
    },
    userName: {
        type: String,
        required: true,
        index : true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique : true,
        index : true
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    schoolId: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: Object.values(Gender),
        default: Gender.BOY,
        required: true
    },
    createdAt: {
        type: Number,
        required: true,
    },
    updatedAt: {
        type: Number,
        required: false,
    },
    recoveryCode: {
        type: String,
        required: false,
    }
});

export const UserModel = model("User", userSchema);
