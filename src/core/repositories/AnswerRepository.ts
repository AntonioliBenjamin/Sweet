import {Answer} from "../Entities/Answer";

export interface AnswerRepository {
    create(answer: Answer): Promise<Answer>;

    getAllBySchoolId(schoolId: string, userId: string): Promise<Answer[]>;

    delete(userId: string): Promise<void>;

    deleteAllByUserId(userId: string): Promise<void>;

    getById(answerId: string): Promise<Answer>;

    markAsRead(answer: Answer): Promise<Answer>;

    getLastQuestionAnswered(pollId: string, userId: string): Promise<Answer>
}