import {Answer} from "../../Entities/Answer";
import {AnswerRepository} from "../../repositories/AnswerRepository";
import {UseCase} from "../Usecase";
import {AnswerErrors} from "../../errors/AnswerErrors";
import {inject, injectable} from "inversify";
import {identifiers} from "../../identifiers/identifiers";

@injectable()
export class AnswerMarkAsRead implements UseCase<string, Answer> {
    constructor(
        @inject(identifiers.AnswerRepository) private readonly answerRepository: AnswerRepository
    ) {
    }

    async execute(answerId: string): Promise<Answer> {

        const answer = await this.answerRepository.getById(answerId);
        if (!answer) {
            throw new AnswerErrors.NotFound();
        }

        answer.markAsRead();
        await this.answerRepository.markAsRead(answer);

        return answer;
    }
}
