import {Answer} from "../../Entities/Answer";
import {AnswerRepository} from "../../repositories/AnswerRepository";
import {UseCase} from "../Usecase";

export class GetMyAnswers implements UseCase<string, Answer[]> {
    constructor(
        private readonly answerRepository: AnswerRepository
    ) {
    }

    async execute(userId: string): Promise<Answer[]> {
        return (await this.answerRepository.getAllBySchoolId()).filter((elm) => elm.props.userId === userId
        );
    }
}
