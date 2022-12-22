import { UseCase } from "../Usecase";
import { Poll } from "../../Entities/Poll";
import { PollRepository } from "../../repositories/PollRepository";
import { IdGateway } from "../../gateways/IdGateway";
import { QuestionRepository } from "../../repositories/QuestionRepository";

export type CreatePollInput = {
  numberOfQuestions: number;
};

export class CreatePoll implements UseCase<CreatePollInput, void> {
  constructor(
    private readonly pollRepository: PollRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly idGateway: IdGateway
  ) {}

  async execute(input: CreatePollInput): Promise<void> {
    const id = this.idGateway.generate();

    const poll = Poll.create({
      pollId: id,
    });

    const questions = await this.questionRepository.selectRandomQuestions(
      input.numberOfQuestions
    );

    poll.update({
      questions: questions,
    });

    await this.pollRepository.update(poll);
    
    return;
  }
}
