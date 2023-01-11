import { UseCase } from "../Usecase";
import { Poll } from "../../Entities/Poll";
import { PollRepository } from "../../repositories/PollRepository";
import { inject, injectable } from "inversify";
import { identifiers } from "../../identifiers/identifiers";


@injectable()
export class GetAllPolls implements UseCase<void, Poll[]> {
  constructor(
    @inject(identifiers.PollRepository) private readonly pollRepository: PollRepository
    ) {}

  async execute(): Promise<Poll[]> {
    return await this.pollRepository.getAllPolls();
  }
}
