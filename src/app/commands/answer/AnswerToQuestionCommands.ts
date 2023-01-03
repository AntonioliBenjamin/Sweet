import { IsString } from 'class-validator';

export class AnswerToQuestionCommands {
    @IsString()
    questionId: string;

    @IsString()
    answerUserId: string;

    @IsString()
    userId: string;
}