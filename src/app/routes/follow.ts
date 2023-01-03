import express from "express";
import {V4IdGateway} from "../../adapters/gateways/V4IdGateway";
import {MongoDbFollowRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbFollowRepository";
import {MongoDbUserRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";
import {FollowUser} from "../../core/usecases/follow/FollowUser";
import { GetMyFollows } from "../../core/usecases/follow/GetMyFollows";
import {UnfollowUser} from "../../core/usecases/follow/UnfollowUser";
import { commandsValidation } from "../commands/CommandsValidation";
import { AddFollowCommands } from "../commands/follow/AddFollowCommands";
import {UserApiUserMapper} from "../dtos/UserApiUserMapper";
import {authorization} from "../middlewares/JwtAuthorizationMiddleware";
import {AuthentifiedRequest} from "../types/AuthentifiedRequest";
const userApiUserMapper = new UserApiUserMapper();
const mongoDbUserRepository = new MongoDbUserRepository()
const followRouter = express.Router();
const mongoDbFollowRepository = new MongoDbFollowRepository();
const v4IdGateway = new V4IdGateway();
const followUser = new FollowUser(mongoDbFollowRepository, v4IdGateway);
const unfollowUser = new UnfollowUser(mongoDbFollowRepository);
const getMyFollows = new GetMyFollows(mongoDbFollowRepository, mongoDbUserRepository)

followRouter.use(authorization);

followRouter.post("/", async (req: AuthentifiedRequest, res) => {
  try {
    const body = new AddFollowCommands()
    body.addedBy = req.user.id;
    body.userId = req.body.userId;
    
    await commandsValidation(body)

    const follow = await followUser.execute(body);

    return res.status(201).send(follow.props);
  } catch (err) {
    console.error(err);

    return res.status(400).send({
      message: "An error occurred",
    });
  }
});

followRouter.get("/", async (req: AuthentifiedRequest, res) => {
  try {
    const users = await getMyFollows.execute(req.user.id);

    return res.send(users.map(elm => userApiUserMapper.fromDomain(elm)));
  } catch (err) {
    console.error(err);

    return res.status(400).send({
      message: "An error occurred",
    });
  }
});

followRouter.delete("/:followId", async (req, res) => {
    try {
        await unfollowUser.execute(req.params.followId);

    return res.sendStatus(200);
  } catch (err) {
    console.error(err);

    return res.status(400).send({
      message: "An error occurred",
    });
  }
});

export { followRouter };
