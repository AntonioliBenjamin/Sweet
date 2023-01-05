import {IsString,validateOrReject} from "class-validator";

export class ResetPasswordCommands {

    @IsString()
    token: string;

    @IsString()
    password: string;

    static async setProperties(body: ResetPasswordCommands) {
        const resetPasswordCommands = new ResetPasswordCommands();
        resetPasswordCommands.token = body.token;
        resetPasswordCommands.password = body.password;
        await validateOrReject(resetPasswordCommands);
        return resetPasswordCommands;
    }
}