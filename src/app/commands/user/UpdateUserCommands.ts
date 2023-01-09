import {IsEnum, IsOptional, IsString} from "class-validator";
import {Gender} from "../../../core/Entities/User";
import {Expose, plainToClass} from "class-transformer";

export class UpdateUserCommands {
    @Expose()
    @IsString()
    userName: string;

    @Expose()
    @IsString()
    firstName: string;

    @Expose()
    @IsString()
    lastName: string;

    @Expose()
    @IsString()
    @IsOptional()
    section: string;

    @Expose()
    @IsEnum(Gender)
    gender: Gender;

    @Expose()
    @IsString()
    schoolId: string;

    static setProperties(cmd: UpdateUserCommands): UpdateUserCommands {
        return plainToClass(UpdateUserCommands, cmd, {excludeExtraneousValues: true});
    }
}