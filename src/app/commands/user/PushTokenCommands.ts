import {IsString} from "class-validator";
import {Expose, plainToClass} from "class-transformer";

export class PushTokenCommands {
    @Expose()
    @IsString()
    userId: string;

    @Expose()
    @IsString()
    pushToken: string;

    static setProperties(cmd: PushTokenCommands): PushTokenCommands {
        return plainToClass(PushTokenCommands, cmd, {excludeExtraneousValues: true});
    }
}