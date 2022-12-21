import {UseCase} from "../Usecase";
import {UserRepository} from "../../repositories/UserRepository";
import { PasswordGateway } from "../../gateways/PasswordGateway";

export type ResetPasswordInput = {
    id: string;
    password: string;
    recoveryCode: string;
}

export class ResetPassword implements UseCase<ResetPasswordInput, void> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly encryptionGateway: PasswordGateway
    ) {
    }

    async execute(input: ResetPasswordInput): Promise<void> {
        const user = await this.userRepository.getById(input.id);
        const encryptedPassword = this.encryptionGateway.encrypt(input.password)

        user.resetPassword({
            recoveryCode: input.recoveryCode,
            password: encryptedPassword,
        });
        await this.userRepository.updatePassword(user);
        return;
    }
}