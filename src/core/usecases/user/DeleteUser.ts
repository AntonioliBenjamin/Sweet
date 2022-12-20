import {UseCase} from "../Usecase";
import {UserRepository} from "../../repositories/UserRepository";
import { FollowedRepository } from "../../repositories/FollowedRepository";
import { AnswerRepository } from "../../repositories/AnswerRepository";

export type UserDeletedInput = {
    userId: string
}

export class DeleteUser implements UseCase<UserDeletedInput, void> {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly followRepository: FollowedRepository,
        private readonly answerRepository: AnswerRepository
        ) {
    }

   async execute(input:UserDeletedInput): Promise<void> {
        const userId = input.userId
        await this.userRepository.delete(userId);
        await this.followRepository.deleteAllByUserId(userId);
        await this.answerRepository.deleteAllByUserId(userId)
        return ;
    }
}