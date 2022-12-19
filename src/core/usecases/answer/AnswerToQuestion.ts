import { UseCase } from "../Usecase";
import { Answer, ResponseProperties } from "../../Entities/Answer";
import { IdGateway } from "../../gateways/IdGateway";
import { AnswerRepository } from "../../repositories/AnswerRepository";
import { QuestionProperties } from "../../Entities/Question";

export type AnswerToQuestionInput = {
    question: QuestionProperties;
    response: ResponseProperties;
    answer: string;
};

export class AnswerToQuestion
  implements UseCase<AnswerToQuestionInput, Answer>
{
  constructor(
    private readonly answerRepository: AnswerRepository,
    private readonly idGateway: IdGateway
  ) {}

  async execute(input: AnswerToQuestionInput): Promise<Answer> {
    const id = this.idGateway.generate();
    const answer = Answer.create({
        answer: input.answer,
        answerId: id,
        question: input.question,
        response: input.response
    });

    return await this.answerRepository.create(answer)
  }
}