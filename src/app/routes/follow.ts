import express from "express";
import {V4IdGateway} from "../../adapters/gateways/V4IdGateway";
import {MongoDbFollowRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbFollowRepository";
import {MongoDbUserRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";
import {Followed} from "../../core/Entities/Followed";
import {FollowUser} from "../../core/usecases/follow/FollowUser";
import {GetFollowersByUsersId} from "../../core/usecases/follow/GetFollowersByUsersId";
import {GetFollowingsByUserId} from "../../core/usecases/follow/GetFollowingsByUserId";
import {UnfollowUser} from "../../core/usecases/follow/UnfollowUser";
import {AddFollowCommand} from "../commands/follow/AddFollowCommand";
import {UserApiUserMapper} from "../dtos/UserApiUserMapper";
import {authorization} from "../middlewares/JwtAuthorizationMiddleware";
import {AuthentifiedRequest} from "../types/AuthentifiedRequest";

const userApiUserMapper = new UserApiUserMapper();
const followRouter = express.Router();
const mongoDbFollowRepository = new MongoDbFollowRepository();
const v4IdGateway = new V4IdGateway();
const followUser = new FollowUser(mongoDbFollowRepository, v4IdGateway);
const unfollowUser = new UnfollowUser(mongoDbFollowRepository);

followRouter.use(authorization);

followRouter.post("/", async (req: AuthentifiedRequest, res) => {
  try {
    const body = {
      addedBy: req.user.id,
      userId: req.body.userId,
    };

    const values = await AddFollowCommand.validateAsync(body);

    const follow = await followUser.execute(values);

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
    const users = await mongoDbFollowRepository.getMyFollows(req.user.id);

    return res.send(users);
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
