import { QuestionRepository } from "../../repositories/QuestionRepository";
import { UseCase } from "../Usecase";

export class DeleteQuestion implements UseCase<string, Promise<void>> {
    constructor(
        private readonly questionRepository: QuestionRepository
    ) {}

    async execute(questionId: string): Promise<void> {
       return await this.questionRepository.delete(questionId)
    }
}