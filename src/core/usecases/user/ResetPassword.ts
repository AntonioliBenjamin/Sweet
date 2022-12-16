import {UseCase} from "../Usecase";
import {UserRepository} from "../../repositories/UserRepository";

export type ResetPasswordInput = {
    id: string;
    password: string;
    recoveryCode: string;
}

export class ResetPassword implements UseCase<ResetPasswordInput, void> {
    constructor(
        private readonly userRepository: UserRepository
    ) {
    }

    async execute(input: ResetPasswordInput): Promise<void> {
        const user = await this.userRepository.getById(input.id);
        user.resetPassword({
            recoveryCode: input.recoveryCode,
            password: input.password,
        });
        await this.userRepository.update(user);
        return;
    }
}