import {QuestionRepository} from "../../../repositories/QuestionRepository";
import {Question} from "../../../Entities/Question";

export class InMemoryQuestionRepository implements QuestionRepository {
    constructor(private readonly db: Map<string, Question>) {
    }

    create(question: Question): Promise<Question> {
        this.db.set(question.props.questionId, question);
        return Promise.resolve(question)
    }
}
