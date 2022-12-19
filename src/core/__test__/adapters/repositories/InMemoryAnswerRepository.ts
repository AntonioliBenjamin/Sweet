import { Answer } from "../../../Entities/Answer";
import { AnswerRepository } from "../../../repositories/AnswerRepository";

export class InMemoryAnswerRepository implements AnswerRepository {
    constructor(
        private readonly db : Map<string, Answer>
    ) {}

    async create(answer: Answer): Promise<Answer> {
        this.db.set(answer.props.answerId, answer)
        return answer
    }

    async getAllAnswers(): Promise<Answer[]> {
        return Array.from(this.db.values());
    }


}