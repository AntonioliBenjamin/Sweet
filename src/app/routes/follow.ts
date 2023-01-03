import express from "express";
import { V4IdGateway } from "../../adapters/gateways/V4IdGateway";
import { MongoDbFollowRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbFollowRepository";
import { FollowUser } from "../../core/usecases/follow/FollowUser";
import { UnfollowUser } from "../../core/usecases/follow/UnfollowUser";
import { AddFollowCommand } from "../commands/follow/AddFollowCommand";
import { DeleteFollowCommand } from "../commands/follow/DeleteFollowCommand";
import { authorization } from "../middlewares/JwtAuthorizationMiddleware";
import { AuthentifiedRequest } from "../types/AuthentifiedRequest";

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
