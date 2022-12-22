import { Question, QuestionProperties } from "../Entities/Question";

export interface QuestionRepository {
  create(input: Question): Promise<Question>;

  getAllQuestions(input: void): Promise<Question[]>;

  selectRandomQuestions(numberOfQuestions: number): Promise<QuestionProperties[]>;

  getByQuestionId(questionId: string): Promise<Question>;
}
