import { AnswerRepository } from "../../repositories/AnswerRepository";
import { UseCase } from "../Usecase";
import {inject, injectable} from "inversify";
import {identifiers} from "../../identifiers/identifiers";

@injectable()
export class DeleteAnswer implements UseCase<string, void> {
  constructor(
      @inject(identifiers.AnswerRepository) private readonly answerRepository: AnswerRepository,
    ) {}

  async execute(id: string): Promise<void> {
    await this.answerRepository.delete(id);

    return;
  }
}
