import { Answer } from "../../../Entities/Answer";
import { Question } from "../../../Entities/Question";
import { AnswerRepository } from "../../../repositories/AnswerRepository";

export class InMemoryAnswerRepository implements AnswerRepository {
  constructor(private readonly db: Map<string, Answer>) {}

  async create(answer: Answer): Promise<Answer> {
    this.db.set(answer.props.answerId, answer);

    return answer;
  }

  async getAllBySchoolId(): Promise<Answer[]> {
    return Array.from(this.db.values());
  }

  async delete(answerId: string): Promise<void> {
    this.db.delete(answerId);
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    const values = Array.from(this.db.values());

    const match = values.filter((elm) => elm.props.userId === userId);
    match.map((elm) => this.db.delete(elm.props.answerId));

    return;
  }

  async getById(answerId: string): Promise<Answer> {
    return this.db.get(answerId);
  }

  async markAsRead(answer: Answer): Promise<Answer> {
    this.db.set(answer.props.answerId, answer);

    return answer;
  }

  async getLastQuestionAnswered(pollId: string, userId: string): Promise<Question> {
    const values = Array.from(this.db.values());
    const answers = values
      .filter((elm) => elm.props.pollId === pollId  && elm.props.response.userId === userId)
      .sort((a, b) => +b.props.createdAt - +a.props.createdAt)[0];

    const question = answers.props.question;
  
    return new Question({
      ...question
    });
  }
}
