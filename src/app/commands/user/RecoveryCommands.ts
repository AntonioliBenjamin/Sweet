import {IsEmail, validateOrReject} from "class-validator";

export class RecoveryCommands {

    @IsEmail()
    email: string;

    static async setProperties(body: RecoveryCommands) {
        const recoveryCommands = new RecoveryCommands();
        recoveryCommands.email = body.email;
        await validateOrReject(recoveryCommands);
        return recoveryCommands;
    }
}