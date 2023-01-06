import { User } from "../../Entities/User";
import { UserRepository } from "../../repositories/UserRepository";
import { UseCase } from "../Usecase";

export type UpdatePushTokenInput = {
    userId: string,
    pushToken: string
}

export class UpdatePushToken implements UseCase<UpdatePushTokenInput, User> {
    constructor(
        private readonly userRepository : UserRepository
    ) {}

    async execute(input: UpdatePushTokenInput): Promise<User> {
        const user = await this.userRepository.getById(input.userId)

        user.updatePushtoken(input.pushToken)

        return await this.userRepository.updatePushtoken(user)
    }
}