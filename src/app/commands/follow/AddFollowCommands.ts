import { IsString } from 'class-validator';

export class AddFollowCommands {
    @IsString()
    addedBy: string;

    @IsString()
    userId: string
}



