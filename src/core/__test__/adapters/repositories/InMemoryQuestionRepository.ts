import { QuestionRepository } from "../../../repositories/QuestionRepository";
import { Question, QuestionProperties } from "../../../Entities/Question";
import { questionFixtures } from "../../../fixtures/questionFixtures";

export class InMemoryQuestionRepository implements QuestionRepository {
  constructor(private readonly db: Map<string, Question>) {}

  create(question: Question): Promise<Question> {
    this.db.set(question.props.questionId, question);

    return Promise.resolve(question);
  }

  async getById(questionId: string): Promise<Question> {
    return this.db.get(questionId)
  }

  async getAll(): Promise<Question[]> {
    return Array.from(this.db.values());
  }

  selectRandom(numberOfQuestions: number): Promise<QuestionProperties[]> {
    return Promise.resolve(questionFixtures);
  }

  delete(questionId: string): Promise<void> {
    this.db.delete(questionId)
    return
  }
}
