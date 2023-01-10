import { Expose, plainToClass } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class AnswerToQuestionCommands {

    @Expose()
    @IsString()
    questionId: string;

    @Expose()
    @IsOptional()
    @IsString()
    friendId: string;

    @Expose()
    @IsString()
    userId: string;

    @Expose()
    @IsString()
    pollId: string;

    static async setProperties(cmd: AnswerToQuestionCommands) {
        return plainToClass(AnswerToQuestionCommands, cmd, { excludeExtraneousValues: true });
    }
}