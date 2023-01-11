import { inject, injectable } from "inversify";
import { identifiers } from "../../identifiers/identifiers";
import { QuestionRepository } from "../../repositories/QuestionRepository";
import { UseCase } from "../Usecase";

@injectable()
export class DeleteQuestion implements UseCase<string, Promise<void>> {
    constructor(
        @inject(identifiers.QuestionRepository) private readonly questionRepository: QuestionRepository
    ) {}

    async execute(questionId: string): Promise<void> {
       return await this.questionRepository.delete(questionId)
    }
}