import { inject, injectable } from "inversify";
import { User } from "../../Entities/User";
import { UserRepository } from "../../repositories/UserRepository";
import { UseCase } from "../Usecase";
import { identifiers } from "../../identifiers/identifiers";

export type UpdatePushTokenInput = {
    userId: string,
    pushToken: string
}


@injectable()
export class UpdatePushToken implements UseCase<UpdatePushTokenInput, User> {
    constructor(
        @inject(identifiers.UserRepository) private readonly userRepository: UserRepository
    ) {}

    async execute(input: UpdatePushTokenInput): Promise<User> {
        const user = await this.userRepository.getById(input.userId)

        user.updatePushtoken(input.pushToken)

        return await this.userRepository.updatePushtoken(user)
    }
}