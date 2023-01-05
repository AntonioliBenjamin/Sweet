import express from "express";
import {MongoDbUserRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";
import {SearchFriends} from "../../core/usecases/friends/SearchFriends";
import {UserApiUserMapper} from "../dtos/UserApiUserMapper";
import {authorization} from "../middlewares/JwtAuthorizationMiddleware";

const friendsRouter = express.Router();
const mongoDbUserRepository = new MongoDbUserRepository()
const searchFriends = new SearchFriends(mongoDbUserRepository)
const userApiUserMapper = new UserApiUserMapper()

friendsRouter.use(authorization);

friendsRouter.get("/search/:keyword/:schoolId?", async (req, res) => {
    const users = await searchFriends.execute({
        keyword: req.params.keyword,
        schoolId: req.params.schoolId
    })

    return res.status(200).send(users.map(elm => userApiUserMapper.fromDomain(elm)))
})

export {friendsRouter}