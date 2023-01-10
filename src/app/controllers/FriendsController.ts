import 'reflect-metadata';
import { Controller, Get, Res, QueryParam } from "routing-controllers";
import { SearchFriends } from "../../core/usecases/friends/SearchFriends";
import { MongoDbUserRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";
import { UserApiResponse } from "../dtos/UserApiUserMapper";
import { Response } from "express";

const mongoDbUserRepository = new MongoDbUserRepository();
const searchFriends = new SearchFriends(mongoDbUserRepository);
const userApiResponse = new UserApiResponse();

@Controller('/friends')
export class FriendsController {

  @Get("/search/:keyword/:schoolId?")
  async searchFriends(
    @Res() res: Response,
    @QueryParam("keyword")  keyword: string,
    @QueryParam("schoolId", { required : false }) schoolId?: string
  ) {
    const users = await searchFriends.execute({
      keyword,
      schoolId,
    });

    return res
      .status(200)
      .send(users.map((elm) => userApiResponse.fromDomain(elm)));
  }
}
