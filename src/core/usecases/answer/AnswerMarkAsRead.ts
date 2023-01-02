import { Answer } from "../../Entities/Answer";
import { AnswerRepository } from "../../repositories/AnswerRepository";
import { UseCase } from "../Usecase";
import {AnswerErrors} from "../../errors/AnswerErrors";

export class AnswerMarkAsRead implements UseCase<string, Answer> {
    constructor(
        private readonly answerRepository: AnswerRepository
    ) {}

    async execute(answerId: string): Promise<Answer> {
        const answersArray = await this.answerRepository.getAllAnswers();
        const answer = await answersArray.filter(elem => elem.props.answerId === answerId)[0];
        if(!answer) {
            if (!answer) {
                throw new AnswerErrors.NotFound();
            }
        }

        answer.markAsRead();
        await this.answerRepository.markAsRead(answer);

        return answer;
    }
}
