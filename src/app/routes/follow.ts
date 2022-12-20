import express from "express";
import { V4IdGateway } from "../../adapters/gateways/V4IdGateway";
import { MongoDbFollowRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbFollowRepository";
import { MongoDbUserRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";
import { Followed } from "../../core/Entities/Followed";
import { FollowUser } from "../../core/usecases/follow/FollowUser";
import { GetFollowersByUsersId } from "../../core/usecases/follow/GetFollowersByUsersId";
import { UnfollowUser } from "../../core/usecases/follow/UnfollowUser";
import { AddFollowCommand } from "../commands/follow/AddFollowCommand";
import { DeleteFollowCommand } from "../commands/follow/DeleteFollowCommand";
import { authorization } from "../middlewares/JwtAuthorizationMiddleware";
import { AuthentifiedRequest } from "../types/AuthentifiedRequest";
const followRouter = express.Router();
const mongoDbFriendShipRepository = new MongoDbFollowRepository();
const mongoDbUserRepository = new MongoDbUserRepository();
const v4IdGateway = new V4IdGateway();
const followUser = new FollowUser(
  mongoDbUserRepository,
  mongoDbFriendShipRepository,
  v4IdGateway
);
const getFollowersByUsersId = new GetFollowersByUsersId(
  mongoDbFriendShipRepository
);
const unfollowUser = new UnfollowUser(mongoDbFriendShipRepository);

followRouter.use(authorization);

followRouter.post("/add", async (req: AuthentifiedRequest, res) => {
  try {
    const body = {
      addedBy: req.body.addedBy,
      userIdArray: req.body.userIdArray,
    };

    const values = await AddFollowCommand.validateAsync(body);

    let followArray = [];
    let follow: Followed;

    for (let i = 0; i < values.userIdArray.length; i++) {
      follow = await followUser.execute({
        addedBy: values.addedBy,
        userId: values.userId[i],
      });
      followArray.push(follow);
    }

    return res.status(201).send(followArray);
  } catch (err) {
    console.error(err);
    return res.status(400).send({
      message: "An error occurred",
    });
  }
});

followRouter.get("/all/:userId", async (req, res) => {
  try {
    const follows = await getFollowersByUsersId.execute(req.params.userId);

    return res.status(200).send(follows.map((elm) => elm.props));
  } catch (err) {
    console.error(err);
    return res.status(400).send({
      message: "An error occurred",
    });
  }
});

followRouter.delete("/", async (req, res) => {
  try {
    const body = {
      id: req.body.id,
    };

    const values = await DeleteFollowCommand.validateAsync(body);

    await unfollowUser.execute(values.id);

    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.status(400).send({
      message: "An error occurred",
    });
  }
});

export { followRouter };
