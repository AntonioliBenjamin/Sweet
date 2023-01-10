import {IsEmail} from "class-validator";
import {Expose, plainToClass} from "class-transformer";

export class RecoveryCommands {
    @Expose()
    @IsEmail()
    email: string;

    static setProperties(cmd: RecoveryCommands): RecoveryCommands {
        return plainToClass(RecoveryCommands, cmd, {excludeExtraneousValues: true});
    }
}