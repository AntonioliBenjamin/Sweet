import { IsString } from 'class-validator';

export class AnswerToQuestionCommands {
    @IsString()
    questionId: string;

    @IsString()
    friendId: string;

    @IsString()
    userId: string;

    @IsString()
    pollId: string;
}