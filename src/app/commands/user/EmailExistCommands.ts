import {IsEmail, IsString, validateOrReject} from "class-validator";

export class EmailExistCommands {

    @IsEmail()
    email: string;

    static async setProperties(body: EmailExistCommands) {
        const emailExistCommands = new EmailExistCommands();
        emailExistCommands.email = body.email;
        await validateOrReject(emailExistCommands);
        return emailExistCommands;
    }
}