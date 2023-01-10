import {IsEmail, IsString} from "class-validator";
import {Expose, plainToClass} from "class-transformer";

export class SignInCommands {
    @Expose()
    @IsEmail()
    email: string;

    @Expose()
    @IsString()
    password: string;

    static setProperties(cmd: SignInCommands): SignInCommands {
        return plainToClass(SignInCommands, cmd, {excludeExtraneousValues: true});
    }
}
