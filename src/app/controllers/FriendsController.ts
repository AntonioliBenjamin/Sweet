import 'reflect-metadata';
import { Controller, Get, Res, QueryParam } from "routing-controllers";
import { SearchFriends } from "../../core/usecases/friends/SearchFriends";
import { UserApiResponse } from "../dtos/UserApiResponse";
import { Response } from "express";
import { injectable } from 'inversify';

const userApiMapper = new UserApiResponse()

@injectable()
@Controller('/friends')
export class FriendsController {
  constructor(
    private readonly _searchFriends : SearchFriends,
  ) {}

  @Get("/search/:keyword/:schoolId?")
  async searchFriends(
    @Res() res: Response,
    @QueryParam("keyword")  keyword: string,
    @QueryParam("schoolId", { required : false }) schoolId?: string
  ) {
    const users = await this._searchFriends.execute({
      keyword,
      schoolId,
    });

    return res
      .status(200)
      .send(users.map((elm) => userApiMapper.fromDomain(elm)));
  }
}
