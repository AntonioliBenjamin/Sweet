import express from "express";
import { V4IdGateway } from "../../adapters/gateways/V4IdGateway";
import { MongoDbFollowRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbFollowRepository";
import { MongoDbUserRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";
import { FollowUser } from "../../core/usecases/follow/FollowUser";
import { GetFollowersByUsersId } from "../../core/usecases/follow/GetFollowersByUsersId";
import { UnfollowUser } from "../../core/usecases/follow/UnfollowUser";
import { authorization } from "../middlewares/JwtAuthorizationMiddleware";
import { AuthentifiedRequest } from "../types/AuthentifiedRequest";
import {AddFriendShipCommand} from "../commands/follow/AddFriendShipCommand";
import {DeleteFriendShipCommand} from "../commands/follow/DeleteFriendShipCommand";
const friendShipRouter = express.Router();
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



friendShipRouter.use(authorization);

friendShipRouter.post("/add", async (req: AuthentifiedRequest, res) => {
  try {
    const body = {
      senderId: req.user.id,
      recipientId: req.body.recipientId,
    };

    const values = await AddFriendShipCommand.validateAsync(body)

    const friendShip = await followUser.execute({
      recipientId: values.recipientId,
      senderId: values.senderId,
    });

    return res.status(201).send(friendShip.props);

  } catch (err) {
    console.error(err);
    return res.status(400).send({
      message: "An error occurred",
    });
  }
});

friendShipRouter.get("/all/:userId", async (req, res) => {
  try {
    
    const friendShips = await getFollowersByUsersId.execute(
      req.params.userId
    );

    return res.status(200).send(friendShips.map((elm) => elm.props));

  } catch (err) {
    console.error(err);
    return res.status(400).send({
      message: "An error occurred",
    });
  }
});

friendShipRouter.delete("/", async (req, res) => {
  try {
    const body = {
      id: req.body.id,
    };

    const values = await DeleteFriendShipCommand.validateAsync(body)

    await unfollowUser.execute(values.id);

    return res.sendStatus(200);

  } catch (err) {
    console.error(err);
    return res.status(400).send({
      message: "An error occurred",
    });
  }
});

export { friendShipRouter };
