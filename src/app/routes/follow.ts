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
import {DeleteFollowCommand} from "../commands/follow/DeleteFollowCommand";
import {UserApiUserMapper} from "../dtos/UserApiUserMapper";
import {authorization} from "../middlewares/JwtAuthorizationMiddleware";
import {AuthentifiedRequest} from "../types/AuthentifiedRequest";
const userApiUserMapper = new UserApiUserMapper();
const followRouter = express.Router();
const mongoDbFollowRepository = new MongoDbFollowRepository();
const mongoDbUserRepository = new MongoDbUserRepository();
const v4IdGateway = new V4IdGateway();
const followUser = new FollowUser(
    mongoDbFollowRepository,
    v4IdGateway
);
const getFollowingsByUserId = new GetFollowingsByUserId(mongoDbFollowRepository, mongoDbUserRepository);
const getFollowersByUserId = new GetFollowersByUsersId(mongoDbFollowRepository, mongoDbUserRepository);
const unfollowUser = new UnfollowUser(mongoDbFollowRepository);

followRouter.use(authorization);

followRouter.post("/", async (req: AuthentifiedRequest, res) => {
    try {
        const body = {
            addedBy: req.user.id,
            userIdArray: req.body.userIdArray,
        };

        const values = await AddFollowCommand.validateAsync(body);

        let followArray = [];
        let follow: Followed;

        for (let i = 0; i < values.userIdArray.length; i++) {
            follow = await followUser.execute({
                addedBy: values.addedBy,
                userId: values.userIdArray[i],
            });
            followArray.push(follow);
        }

        return res.status(201).send(followArray.map(elm => elm.props));

    } catch (err) {
        console.error(err);

        return res.status(400).send({
            message: "An error occurred",
        });
    }
});

followRouter.get("/mine", async (req: AuthentifiedRequest, res) => { // les gens que je follow
    try {
        const users = await getFollowingsByUserId.execute(req.user.id);

        const followings = users.map(elm => {
            return userApiUserMapper.fromDomain(elm)
        })

        return res.status(200).send(followings);

    } catch (err) {
        console.error(err);

        return res.status(400).send({
            message: "An error occurred",
        });
    }
})

followRouter.get("/theirs", async (req: AuthentifiedRequest, res) => { // les gens qui me follow
    try {
        const users = await getFollowersByUserId.execute(req.user.id);

        const followers = users.map(elm => {
            return userApiUserMapper.fromDomain(elm)
        })

        return res.status(200).send(followers);

    } catch (err) {
        console.error(err);

        return res.status(400).send({
            message: "An error occurred",
        });
    }
})

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

export {followRouter};
