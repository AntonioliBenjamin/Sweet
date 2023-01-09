import {Gender} from "../../../core/Entities/User";
import {IsEmail, IsEnum, IsInt, IsOptional, IsString, Min} from "class-validator";
import {Expose, plainToClass} from "class-transformer";

export class SignUpCommands {
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
    @IsEmail()
    email: string;

    @Expose()
    @IsString()
    password: string;

    @Expose()
    @IsInt()
    @Min(13)
    age: number;

    @Expose()
    @IsString()
    schoolId: string;

    @Expose()
    @IsString()
    @IsOptional()
    section: string;

    @Expose()
    @IsEnum(Gender)
    gender: Gender;

    static setProperties(cmd: SignUpCommands): SignUpCommands {
        return plainToClass(SignUpCommands, cmd, {excludeExtraneousValues: true});
    }

}
