import { Answer } from "../../Entities/Answer";
import { AnswerRepository } from "../../repositories/AnswerRepository";
import { UseCase } from "../Usecase";

export class GetFriendAnswers implements UseCase<string, Answer[]> {
    constructor(
        private readonly answerRepository : AnswerRepository
    ) {}
    async execute(friendId: string): Promise<Answer[]> {
        return await (await this.answerRepository.getAllAnswers()).filter(elm => elm.props.answer === friendId)
    }
}