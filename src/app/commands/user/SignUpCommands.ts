import {Gender} from "../../../core/Entities/User";
import {IsEmail, IsEnum, IsInt, IsString,Min} from "class-validator";
import {plainToClass} from "class-transformer"

export class SignUpCommands {
    @IsString()
    userName: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsInt()
    @Min(13)
    age: number;

    @IsString()
    schoolId: string;

    @IsString()
    section: string;

    @IsEnum(Gender)
    gender: Gender;

    static setProperties(cmd: SignUpCommands):  SignUpCommands {
        return plainToClass( SignUpCommands, cmd, { excludeExtraneousValues: true });
    }
}
