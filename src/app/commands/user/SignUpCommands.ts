import {Gender} from "../../../core/Entities/User";
import {IsEmail, IsEnum, IsInt, IsString, Min, validateOrReject} from "class-validator";

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

    static async setProperties(body: SignUpCommands) {
        const signUpCommands = new SignUpCommands();
        signUpCommands.userName = body.userName;
        signUpCommands.firstName = body.firstName;
        signUpCommands.lastName = body.lastName;
        signUpCommands.email = body.email;
        signUpCommands.password = body.password;
        signUpCommands.age = body.age;
        signUpCommands.schoolId = body.schoolId;
        signUpCommands.section = body.section;
        signUpCommands.gender = body.gender;
        await validateOrReject(signUpCommands);
        return signUpCommands;
    }
}
