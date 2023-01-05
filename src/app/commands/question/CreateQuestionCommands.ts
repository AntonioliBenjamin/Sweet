import {IsString, validateOrReject} from 'class-validator';

export class CreateQuestionCommands {
    @IsString()
    description: string;

    @IsString()
    picture: string;

    static async setProperties(body: CreateQuestionCommands) {
        const createQuestionCommands = new CreateQuestionCommands();
        createQuestionCommands.description = body.description;
        createQuestionCommands.picture = body.picture;
        await validateOrReject(createQuestionCommands);
        return createQuestionCommands;
    }
}