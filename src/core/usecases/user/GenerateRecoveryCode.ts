import {inject, injectable} from "inversify";
import {UserRepository} from "../../repositories/UserRepository";
import {UseCase} from "../Usecase";
import {UserErrors} from "../../errors/UserErrors";
import {IdGateway} from "../../gateways/IdGateway";
import {User} from "../../Entities/User";
import {identifiers} from "../../identifiers/identifiers";
import {EventDispatcher, MessageIdentifiers} from "ddd-messaging-bus/src"
import {RecoveryCodeGenerated} from "../../../messages/user/RecoveryCodeGenerated";

export type GenerateRecoveryCodeInput = {
    email: string;
};

@injectable()
export class GenerateRecoveryCode
    implements UseCase<GenerateRecoveryCodeInput, User> {
    constructor(
        @inject(identifiers.UserRepository) private readonly userRepository: UserRepository,
        @inject(identifiers.IdGateway) private readonly idGateway: IdGateway,
        @inject(MessageIdentifiers.EventDispatcher) private readonly eventDispatcher: EventDispatcher
    ) {
    }

    async execute(input: GenerateRecoveryCodeInput): Promise<User> {
        const user = await this.userRepository.getByEmail(input.email);
        if (!user) {
            throw new UserErrors.WrongEmail();
        }

        const recoveryCode = this.idGateway.generate();

        user.updateRecoveryCode(recoveryCode);

        await this.userRepository.update(user);

        const recoverCodeGenerated = new RecoveryCodeGenerated({
            email: user.props.email,
            userName: user.props.userName,
            recoveryCode: user.props.recoveryCode,
            id: user.props.id
        })

        await this.eventDispatcher.dispatch(recoverCodeGenerated)

        return user;
    }
}
