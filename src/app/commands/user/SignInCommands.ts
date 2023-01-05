import {IsEmail, IsString,validateOrReject} from "class-validator";

export class SignInCommands {

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    static async setProperties(body: SignInCommands) {
        const signInCommands = new SignInCommands();
        signInCommands.email = body.email;
        signInCommands.password = body.password;
        await validateOrReject(signInCommands);
        return signInCommands;
    }
}
