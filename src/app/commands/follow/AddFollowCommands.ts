import {IsString, validateOrReject} from 'class-validator';

export class AddFollowCommands {
    @IsString()
    addedBy: string;

    @IsString()
    userId: string

    static async setProperties(body: AddFollowCommands) {
        const addFollowCommands = new AddFollowCommands();
        addFollowCommands.addedBy = body.addedBy;
        addFollowCommands.userId = body.userId;
        await validateOrReject(addFollowCommands);
        return addFollowCommands;
    }
}



