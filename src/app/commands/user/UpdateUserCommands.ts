import {IsEnum, IsOptional, IsString, validateOrReject} from "class-validator";
import {Gender} from "../../../core/Entities/User";

export class UpdateUserCommands {
    @IsString()
    userName: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    @IsOptional()
    section: string;

    @IsEnum(Gender)
    gender: Gender;

    @IsString()
    schoolId : string;

    static async setProperties(body: UpdateUserCommands) {
        const updateUserCommands = new UpdateUserCommands();
        updateUserCommands.userName = body.userName;
        updateUserCommands.firstName = body.firstName;
        updateUserCommands.lastName = body.lastName;
        updateUserCommands.section = body.section;
        updateUserCommands.gender = body.gender;
        updateUserCommands.schoolId = body.schoolId;
        await validateOrReject(updateUserCommands);
        return updateUserCommands;
    }
}