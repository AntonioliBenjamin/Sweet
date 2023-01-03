import {Answer} from "../../../Entities/Answer";
import {AnswerRepository} from "../../../repositories/AnswerRepository";

export class InMemoryAnswerRepository implements AnswerRepository {
    constructor(
        private readonly db: Map<string, Answer>
    ) {
    }

    async create(answer: Answer): Promise<Answer> {
        this.db.set(answer.props.answerId, answer);

        return answer;
    }

    async getAllAnswers(): Promise<Answer[]> {
        return Array.from(this.db.values());
    }

    async delete(answerId: string): Promise<void> {
        this.db.delete(answerId);
    }

    async deleteAllByUserId(userId: string): Promise<void> {
        const values = Array.from(this.db.values());

        const match = values.filter(elm => elm.props.answer === userId);
        match.map(elm => this.db.delete(elm.props.answerId));

        return;
    }

    async markAsRead(answer: Answer): Promise<Answer> {
        this.db.set(answer.props.answerId, answer);

        return answer;
    }
}