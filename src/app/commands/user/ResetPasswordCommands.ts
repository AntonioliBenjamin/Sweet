import {IsString} from "class-validator";
import {Expose, plainToClass} from "class-transformer";

export class ResetPasswordCommands {
    @Expose()
    @IsString()
    token: string;

    @Expose()
    @IsString()
    password: string;

    static setProperties(cmd: ResetPasswordCommands): ResetPasswordCommands {
        return plainToClass(ResetPasswordCommands, cmd, {excludeExtraneousValues: true});
    }
}