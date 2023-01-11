import {Answer} from "../../Entities/Answer";
import {AnswerRepository} from "../../repositories/AnswerRepository";
import {UseCase} from "../Usecase";
import {inject, injectable} from "inversify";
import {identifiers} from "../../identifiers/identifiers";

@injectable()
export class GetMyAnswers implements UseCase<string, Answer[]> {
    constructor(
        @inject(identifiers.AnswerRepository) private readonly answerRepository: AnswerRepository,
    ) {
    }

    async execute(userId: string): Promise<Answer[]> {
        return await this.answerRepository.getAllByUserId(userId)
    }
}
