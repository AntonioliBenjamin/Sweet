import express from "express";
import {MongoDbUserRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";
import {SearchFriends} from "../../core/usecases/friends/SearchFriends";
import {UserApiResponse} from "../dtos/UserApiUserMapper";
import {authorization} from "../middlewares/JwtAuthorizationMiddleware";

const friendsRouter = express.Router();
const mongoDbUserRepository = new MongoDbUserRepository()
const searchFriends = new SearchFriends(mongoDbUserRepository)
const userApiResponse = new UserApiResponse()

friendsRouter.use(authorization);

friendsRouter.get("/search/:keyword/:schoolId?", async (req, res) => {
    const users = await searchFriends.execute({
        keyword: req.params.keyword,
        schoolId: req.params.schoolId
    })

    return res.status(200).send(users.map(elm => userApiResponse.fromDomain(elm)))
})

export {friendsRouter}