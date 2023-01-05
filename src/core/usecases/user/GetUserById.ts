import {UseCase} from "../Usecase";
import {UserRepository} from "../../repositories/UserRepository";
import {FollowedRepository} from "../../repositories/FollowedRepository";
import {AnswerRepository} from "../../repositories/AnswerRepository";
import {User} from "../../Entities/User";

export type GetUserByIdInput = {
    userId: string;
};

export class GetUserById implements UseCase<GetUserByIdInput, User> {
    constructor(
        private readonly userRepository: UserRepository,
    ) {
    }

    async execute(input: GetUserByIdInput): Promise<User> {
        return await this.userRepository.getById(input.userId);
    }
}