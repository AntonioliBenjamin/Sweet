import 'reflect-metadata';
import {Param,Get,Post,Res,Body,UseBefore,Req,JsonController,Delete,} from "routing-controllers";
import { Response } from "express";
import { FollowUser } from "../../core/usecases/follow/FollowUser";
import { GetMyFollows } from "../../core/usecases/follow/GetMyFollows";
import { UnfollowUser } from "../../core/usecases/follow/UnfollowUser";
import { AddFollowCommands } from "../commands/follow/AddFollowCommands";
import { UserApiResponse } from "../dtos/UserApiUserMapper";
import { authorization } from "../middlewares/JwtAuthorizationMiddleware";
import { AuthentifiedRequest } from "../types/AuthentifiedRequest";
import {injectable} from "inversify";

@injectable()
@JsonController("/follow")
@UseBefore(authorization)
export class FollowController {
  constructor(
      private readonly _followUser : FollowUser,
      private readonly _getMyFollows : GetMyFollows,
      private readonly _unFollowUser : UnfollowUser,
private readonly _userApiUserMapper : UserApiResponse
  ){}
  
  @Post()
  async followUser(
    @Res() res: Response,
    @Req() req: AuthentifiedRequest,
    @Body() cmd: any
  ) {
    const body = await AddFollowCommands.setProperties({
      addedBy: req.user.id,
      userId: cmd.userId
    })

    const follow = await this._followUser.execute(body);
    return res.status(201).send(follow.props);
  }

  @Get()
  async getMyFollows(@Req() req: AuthentifiedRequest, @Res() res: Response) {
    const users = await this._getMyFollows.execute(req.user.id);
    return res.send(users.map((elm) => this._userApiUserMapper.fromDomain(elm)));
  }

  @Delete("/:friendId")
  async unFollowUser(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param("friendId") friendId: string
  ) {
    await this._unFollowUser.execute({
      userId: friendId,
      addedBy: req.user.id,
    });

    return res.sendStatus(200);
  }
}
