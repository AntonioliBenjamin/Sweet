import { Answer } from "../../Entities/Answer";
import { AnswerRepository } from "../../repositories/AnswerRepository";
import { UseCase } from "../Usecase";

export class GetAllAnswers implements UseCase<void, Answer[]> {
  constructor(
    private readonly answerRepository: AnswerRepository
    ) {}

  execute(): Promise<Answer[]> {
    return this.answerRepository.getAllBySchoolId();
  }
}
