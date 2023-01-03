import { IsString } from 'class-validator';

export class CreateQuestionCommands {
  @IsString()
  description: string;

  @IsString()
  picture: string;
}