import { Question, QuestionProperties } from "../Entities/Question";

export interface QuestionRepository {
  create(input: Question): Promise<Question>;

  getAll(input: void): Promise<Question[]>;

  selectRandom(numberOfQuestions: number): Promise<QuestionProperties[]>;

  delete(questionId: string): Promise<void>;
}
