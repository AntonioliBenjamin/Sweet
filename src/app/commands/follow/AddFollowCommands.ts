import { Expose, plainToClass } from "class-transformer";
import { IsString } from "class-validator";

export class AddFollowCommands {
  @Expose()
  @IsString()
  addedBy: string;

  @Expose()
  @IsString()
  userId: string;

  static async setProperties(cmd: AddFollowCommands) {
    return plainToClass(AddFollowCommands, cmd, {
      excludeExtraneousValues: true,
    });
  }
}
