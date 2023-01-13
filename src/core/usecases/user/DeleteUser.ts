import { inject, injectable } from "inversify";
import { UseCase } from "../Usecase";
import { UserRepository } from "../../repositories/UserRepository";
import { FollowedRepository } from "../../repositories/FollowedRepository";
import { AnswerRepository } from "../../repositories/AnswerRepository";
import { identifiers } from "../../identifiers/identifiers";

export type UserDeletedInput = {
  userId: string;
};

@injectable()
export class DeleteUser implements UseCase<UserDeletedInput, void> {
  constructor(
    @inject(identifiers.UserRepository) private readonly userRepository: UserRepository,
    @inject(identifiers.FollowedRepository) private readonly followRepository: FollowedRepository,
    @inject(identifiers.AnswerRepository) private readonly answerRepository: AnswerRepository
  ) {}

  async execute(input: UserDeletedInput): Promise<void> {
    const userId = input.userId;

    await this.userRepository.delete(userId);
    await this.followRepository.deleteAllByUserId(userId);
    await this.answerRepository.deleteAllByUserId(userId);

    return;
  }
}
