import { Expose, plainToClass } from "class-transformer";
import { IsString } from "class-validator";

export class CreateQuestionCommands {
  @Expose()
  @IsString()
  description: string;

  @Expose()
  @IsString()
  picture: string;

  static async setProperties(cmd: CreateQuestionCommands) {
    return plainToClass(CreateQuestionCommands, cmd, {
      excludeExtraneousValues: true,
    });
  }
}
