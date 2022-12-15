import {UseCase} from "../Usecase";
import {Question} from "../../Entities/Question";
import {QuestionRepository} from "../../repositories/QuestionRepository";
import {IdGateway} from "../../gateways/IdGateway";


export type QuestionInput = {
    question: string;
    picture: string;
};

export class CreateQuestion implements UseCase<QuestionInput, Question> {
    constructor(
        private readonly questionRepository: QuestionRepository,
        private readonly idGateway: IdGateway
    ) {

    }

    async execute(input: QuestionInput): Promise<Question> {
        const id = this.idGateway.generate();
        const question = Question.create({
            questionId: id,
            question: input.question,
            picture: input.picture
        });
        return await this.questionRepository.create(question);
    }
}
