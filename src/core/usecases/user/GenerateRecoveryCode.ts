import {UserRepository} from "../../repositories/UserRepository";
import {UseCase} from "../Usecase";
import {UserErrors} from "../../errors/UserErrors";
import {IdGateway} from "../../gateways/IdGateway";
import {User} from "../../Entities/User";

export type GenerateRecoveryCodeInput = {
    email: string;
}

export class GenerateRecoveryCode implements UseCase<GenerateRecoveryCodeInput, User> {
    constructor(private readonly userRepository: UserRepository,
                private readonly idGateway: IdGateway
    ) {
    }

    async execute(input: GenerateRecoveryCodeInput): Promise<User> {
        const user = await this.userRepository.getByEmail(input.email);
        if (!user) {
            throw new UserErrors.NotFound();
        }
        const code = this.idGateway.generate();
        user.generateRecoveryCode(code);
        await this.userRepository.update(user);
        return user;
    }
}