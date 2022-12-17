import express from "express";
import { V4IdGateway } from "../../adapters/gateways/V4IdGateway";
import { MongoDbFriendShiprepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbFriendShipRepository";
import { MongoDbUserRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";
import { CreateFriendShip } from "../../core/usecases/friendShip/CreateFriendShip";
import { DeleteFriendShip } from "../../core/usecases/friendShip/DeleteFriendShip";
import { GetAllFriendShipsByUserId } from "../../core/usecases/friendShip/GetAllFriendShipsByUserId";
import { AddFriendShipCommand } from "../commands/friendShip/AddFriendShipCommand";
import { DeleteFriendShipCommand } from "../commands/friendShip/DeleteFriendShipCommand";
import { authorization } from "../middlewares/JwtAuthorizationMiddleware";
import { AuthentifiedRequest } from "../types/AuthentifiedRequest";
const friendShipRouter = express.Router();
const mongoDbFriendShiprepository = new MongoDbFriendShiprepository();
const mongoDbUserRepository = new MongoDbUserRepository();
const v4IdGateway = new V4IdGateway();
const createFriendShip = new CreateFriendShip(
  mongoDbUserRepository,
  mongoDbFriendShiprepository,
  v4IdGateway
);
const getAllFriendShipsByUserId = new GetAllFriendShipsByUserId(
  mongoDbFriendShiprepository
);
const deleteFriendShip = new DeleteFriendShip(mongoDbFriendShiprepository);



friendShipRouter.use(authorization);

friendShipRouter.post("/add", async (req: AuthentifiedRequest, res) => {
  try {
    const body = {
      senderId: req.user.id,
      recipientId: req.body.recipientId,
    };

    const values = await AddFriendShipCommand.validateAsync(body)

    const friendShip = await createFriendShip.execute({
      recipientId: values.recipientId,
      senderId: values.senderId,
    });

    return res.status(201).send(friendShip.props);

  } catch (err) {
    console.error(err);
    return res.status(400).send({
      message: "An error occured",
    });
  }
});

friendShipRouter.get("/all/:userId", async (req, res) => {
  try {
    
    const friendShips = await getAllFriendShipsByUserId.execute(
      req.params.userId
    );

    return res.status(200).send(friendShips.map((elm) => elm.props));

  } catch (err) {
    console.error(err);
    return res.status(400).send({
      message: "An error occured",
    });
  }
});

friendShipRouter.delete("/", async (req, res) => {
  try {
    const body = {
      id: req.body.id,
    };

    const values = await DeleteFriendShipCommand.validateAsync(body)

    await deleteFriendShip.execute(values.id);

    return res.sendStatus(200);

  } catch (err) {
    console.error(err);
    return res.status(400).send({
      message: "An error occured",
    });
  }
});

export { friendShipRouter };
