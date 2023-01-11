import { UseCase } from "../Usecase";
import { Question } from "../../Entities/Question";
import { QuestionRepository } from "../../repositories/QuestionRepository";
import { inject, injectable } from "inversify";
import { identifiers } from "../../identifiers/identifiers";


@injectable()
export class GetAllQuestions implements UseCase<void, Question[]> {
    constructor(
        @inject(identifiers.QuestionRepository) private readonly questionRepository: QuestionRepository
    ) {
    }

    async execute(): Promise<Question[]> {
        return await this.questionRepository.getAll()
    }
}
