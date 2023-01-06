import { IsOptional, IsString, validateOrReject } from 'class-validator';

export class AnswerToQuestionCommands {
    @IsString()
    questionId: string;

    @IsOptional()
    @IsString()
    friendId: string;

    @IsString()
    userId: string;

    @IsString()
    pollId: string;

    static async setProperties(body: AnswerToQuestionCommands) {
        const answerToQuestionCommands = new AnswerToQuestionCommands();
        answerToQuestionCommands.friendId = body.friendId;
        answerToQuestionCommands.pollId = body.pollId;
        answerToQuestionCommands.questionId = body.questionId;
        answerToQuestionCommands.userId = body.userId;
        await validateOrReject(answerToQuestionCommands);
        return answerToQuestionCommands;
    }
}