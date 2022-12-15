import {UserRepository} from "../../repositories/UserRepository";
import {UseCase} from "../Usecase";
import {UserErrors} from "../../errors/UserErrors";
import {IdGateway} from "../../gateways/IdGateway";

export type GenerateRecoveryCodeInput = {
    email: string;
}

export class GenerateRecoveryCode implements UseCase<GenerateRecoveryCodeInput, void> {

    constructor(private readonly userRepository: UserRepository,
                private readonly idGateway: IdGateway
    ) {
    }

    async execute(input: GenerateRecoveryCodeInput): Promise<void> {
        const user = await this.userRepository.getByEmail(input.email);
        if (!user) {
            throw new UserErrors.DoesntExist();
        }
        const code = this.idGateway.generate();
        user.generateRecoveryCode(code);
        await this.userRepository.update(user);
        return;
    }

}