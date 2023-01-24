import { EventHandler } from "ddd-messaging-bus/src"
import {RecoveryCodeGenerated} from "../../messages/user/RecoveryCodeGenerated";
import jwt from "jsonwebtoken";
import {inject, injectable} from "inversify";
import {EmailGateway} from "../../core/gateways/EmailGateway";
import {identifiers} from "../../core/identifiers/identifiers";

const secretKey = process.env.SECRET_KEY;

@injectable()
export class RecoveryCodeGeneratedHandler implements EventHandler {

    constructor(@inject(identifiers.EmailGateway) private readonly _sendGridGateway : EmailGateway){}

    async handle(domainEvent: RecoveryCodeGenerated): Promise<void> {
        console.log(domainEvent)
        const token = jwt.sign(
            {
                id: domainEvent.props.id,
                recoveryCode: domainEvent.props.recoveryCode,
            },
            secretKey,
            {expiresIn: "1h"}
        );

        await this._sendGridGateway.sendRecoveryCode({
            email: domainEvent.props.email,
            resetLink: `http://localhost:3005/views/reset?trustedKey=${token}`,
            userName: domainEvent.props.userName,
        });

        return Promise.resolve(undefined);
    }
}