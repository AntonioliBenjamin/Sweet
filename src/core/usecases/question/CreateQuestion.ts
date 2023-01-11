import {UseCase} from "../Usecase";
import {Question} from "../../Entities/Question";
import {QuestionRepository} from "../../repositories/QuestionRepository";
import {IdGateway} from "../../gateways/IdGateway";
import { inject, injectable } from "inversify";
import { identifiers } from "../../identifiers/identifiers";

export type CreateQuestionInput = {
  description: string;
  picture: string;
};

@injectable()
export class CreateQuestion implements UseCase<CreateQuestionInput, Question> {
  constructor(
    @inject(identifiers.QuestionRepository) private readonly questionRepository: QuestionRepository,
    @inject(identifiers.IdGateway) private readonly idGateway: IdGateway
  ) {}

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
