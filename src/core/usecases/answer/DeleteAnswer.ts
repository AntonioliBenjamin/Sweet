import { AnswerRepository } from "../../repositories/AnswerRepository";
import { UseCase } from "../Usecase";

export class DeleteAnswer implements UseCase<string, void> {
  constructor(
    private readonly answerRepository: AnswerRepository
    ) {}

  async execute(id: string): Promise<void> {
    await this.answerRepository.delete(id);

    return;
  }
}
