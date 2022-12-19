import { Answer } from "../Entities/Answer";

export interface AnswerRepository {
    create(answer: Answer): Promise<Answer>
    getAllAnswers(): Promise<Answer[]>
}