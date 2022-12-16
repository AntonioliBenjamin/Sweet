import {UseCase} from "../Usecase";
import {Question} from "../../Entities/Question";
import {QuestionRepository} from "../../repositories/QuestionRepository";
import {IdGateway} from "../../gateways/IdGateway";


export type CreateQuestionInput = {
    description: string;
    picture: string;
};

export class CreateQuestion implements UseCase<CreateQuestionInput, Question> {
    constructor(
        private readonly questionRepository: QuestionRepository,
        private readonly idGateway: IdGateway
    ) {

    }

    async execute(input: CreateQuestionInput): Promise<Question> {
        const id = this.idGateway.generate();
        const question = Question.create({
            questionId: id,
            description: input.description,
            picture: input.picture
        });
        return await this.questionRepository.create(question);
    }
}
