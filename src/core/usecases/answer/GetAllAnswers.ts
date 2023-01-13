import { Answer } from "../../Entities/Answer";
import { AnswerRepository } from "../../repositories/AnswerRepository";
import { UseCase } from "../Usecase";
import {inject, injectable} from "inversify";
import {identifiers} from "../../identifiers/identifiers";

export type GetAllAnswersInput = {
  schoolId: string;
  userId: string;
}

@injectable()
export class GetAllAnswers implements UseCase<GetAllAnswersInput, Answer[]> {
  constructor(
      @inject(identifiers.AnswerRepository) private readonly answerRepository: AnswerRepository,
    ) {}

  execute(input: GetAllAnswersInput): Promise<Answer[]> {
    return this.answerRepository.getAllBySchoolId(input.schoolId, input.userId);
  }
}
