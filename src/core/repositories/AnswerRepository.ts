import {Answer} from "../Entities/Answer";

export interface AnswerRepository {
    create(answer: Answer): Promise<Answer>;

    getAllAnswers(): Promise<Answer[]>;

    delete(userId: string): Promise<void>;

    deleteAllByUserId(userId: string): Promise<void>;

    getById(answerId: string): Promise<Answer>;
    markAsRead(answer: Answer): Promise<Answer>;
}