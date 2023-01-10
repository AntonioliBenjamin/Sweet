import "reflect-metadata";
import { inject, injectable } from "inversify";
import {UseCase} from "../Usecase";
import {UserRepository} from "../../repositories/UserRepository";
import {User} from "../../Entities/User";
import { identifiers } from "../../identifiers/identifiers";

export type GetUserByIdInput = {
    userId: string;
};

@injectable()
export class GetUserById implements UseCase<GetUserByIdInput, User> {
    @inject(identifiers.UserRepository) private readonly userRepository: UserRepository;

    async execute(input: GetUserByIdInput): Promise<User> {
        return await this.userRepository.getById(input.userId);
    }
}