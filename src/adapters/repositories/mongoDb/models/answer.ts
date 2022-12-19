import { model, Schema } from "mongoose";
import { ResponseProperties } from "../../../../core/Entities/Answer";
import { QuestionProperties } from "../../../../core/Entities/Question";
import { Gender } from "../../../../core/Entities/User";

export type AnswerModel = {
    answerId: string;
    question: QuestionProperties;
    response: ResponseProperties;
    answer: string;
    createdAt: number;
}

const answerSchema = new Schema({
    answerId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    question: {
        type: {
            questionId: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            picture: {
                type: String,
                required: true
            }
        },
        required: true
    },
    response: {
        type: {
            userId: {
                type: String,
                required: true,
                index: true
            },
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
            userName: {
                type: String,
                required: true,
            },
            schoolId: {
                type: String,
                required: true,
            },
            section: {
                type: String,
                required: true,
            },
            gender: {
                type: String,
                enum: Object.values(Gender),
                default: Gender.BOY,
                required: true
            },
        },
        required: true
    },
    answer: {
        type: String,
        required: true,
        index: true
    },
    createdAt: {
        type: Number,
        required: true
    }
})

export const AnswerModel = model("answer", answerSchema);