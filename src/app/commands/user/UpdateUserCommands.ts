import {IsEnum, IsString, validateOrReject} from "class-validator";
import {Gender} from "../../../core/Entities/User";

export class UpdateUserCommands {
    @IsString()
    userName: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    section: string;

    @IsEnum(Gender)
    gender: Gender;

    static async setProperties(body: UpdateUserCommands) {
        const updateUserCommands = new UpdateUserCommands();
        updateUserCommands.userName = body.userName;
        updateUserCommands.firstName = body.firstName;
        updateUserCommands.lastName = body.lastName;
        updateUserCommands.section = body.section;
        updateUserCommands.gender = body.gender;
        await validateOrReject(updateUserCommands);
        return updateUserCommands;
    }
}