import { Answer } from "../../Entities/Answer";
import { AnswerRepository } from "../../repositories/AnswerRepository";
import { UseCase } from "../Usecase";

export type GetAllAnswersInput = {
  schoolId: string;
  userId: string;
}

export class GetAllAnswers implements UseCase<GetAllAnswersInput, Answer[]> {
  constructor(
    private readonly answerRepository: AnswerRepository
    ) {}

  execute(input: GetAllAnswersInput): Promise<Answer[]> {
    return this.answerRepository.getAllBySchoolId(input.schoolId, input.userId);
  }
}
