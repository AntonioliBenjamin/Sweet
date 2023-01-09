import 'reflect-metadata';
import {
  Param,
  Get,
  Post,
  Res,
  Body,
  UseBefore,
  Req,
  JsonController,
  Delete,
} from "routing-controllers";
import { Response } from "express";
import { V4IdGateway } from "../../adapters/gateways/V4IdGateway";
import { MongoDbFollowRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbFollowRepository";
import { MongoDbUserRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";
import { FollowUser } from "../../core/usecases/follow/FollowUser";
import { GetMyFollows } from "../../core/usecases/follow/GetMyFollows";
import { UnfollowUser } from "../../core/usecases/follow/UnfollowUser";
import { AddFollowCommands } from "../commands/follow/AddFollowCommands";
import { UserApiResponse } from "../dtos/UserApiUserMapper";
import { authorization } from "../middlewares/JwtAuthorizationMiddleware";
import { AuthentifiedRequest } from "../types/AuthentifiedRequest";

const userApiUserMapper = new UserApiResponse();
const mongoDbUserRepository = new MongoDbUserRepository();
const mongoDbFollowRepository = new MongoDbFollowRepository();
const v4IdGateway = new V4IdGateway();
const followUser = new FollowUser(mongoDbFollowRepository, v4IdGateway);
const unfollowUser = new UnfollowUser(mongoDbFollowRepository);
const getMyFollows = new GetMyFollows(
  mongoDbFollowRepository,
  mongoDbUserRepository
);

@JsonController("/follow")
@UseBefore(authorization)
export class FollowController {
  
  @Post()
  async followUser(
    @Res() res: Response,
    @Body() cmd: AddFollowCommands
  ) {
    console.log(cmd)
    const body = await AddFollowCommands.setProperties(cmd)
    const follow = await followUser.execute(body);
    return res.status(201).send(follow.props);
  }

  @Get()
  async getMyFollows(@Req() req: AuthentifiedRequest, @Res() res: Response) {
    const users = await getMyFollows.execute(req.user.id);
    return res.send(users.map((elm) => userApiUserMapper.fromDomain(elm)));
  }

  @Delete("/:friendId")
  async unFollowUser(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param("friendId") friendId: string
  ) {
    await unfollowUser.execute({
      userId: friendId,
      addedBy: req.user.id,
    });

    return res.sendStatus(200);
  }
}
