import 'reflect-metadata';
import { Get, Res, UseBefore, Req, Controller } from "routing-controllers";
import { Response } from "express";
import { authorization } from "../middlewares/JwtAuthorizationMiddleware";
import { AuthentifiedRequest } from "../types/AuthentifiedRequest";
import { MongoDbPollRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbPollRepository";
import { GetAllPolls } from "../../core/usecases/poll/GetAllPolls";
import { GetCurrentPoll } from "../../core/usecases/poll/GetCurrentPoll";
import { MongoDbAnswerRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbAnswerRepository";
import { GetLastQuestionAnswered } from "../../core/usecases/answer/GetLastQuestionAnswered";
import { PollApiResponse } from "../dtos/PollApiResponse";

const mongoDbPollRepository = new MongoDbPollRepository();
const mongoDbAnswerRepository = new MongoDbAnswerRepository();
const getAllPolls = new GetAllPolls(mongoDbPollRepository);
const getCurrentPoll = new GetCurrentPoll(mongoDbPollRepository);
const pollApimapper = new PollApiResponse();
const lastQuestionAnswered = new GetLastQuestionAnswered(
  mongoDbAnswerRepository
);

@Controller('/poll')
@UseBefore(authorization)
export class PollController {
    
  @Get('/all')
  async getAllPolls(@Res() res: Response) {
    const polls = await getAllPolls.execute();
    return res.status(200).send(polls.map((elm) => elm.props));
  }

  @Get("/current")
  async getCurentPoll(@Res() res: Response, @Req() req: AuthentifiedRequest) {
    const currentPoll = await getCurrentPoll.execute();

    const lastAnswer = await lastQuestionAnswered.execute({
      pollId: currentPoll.props.pollId,
      userId: req.user.id,
    });

    const pollApiResponse = pollApimapper.fromDomain(currentPoll, lastAnswer);

    return res.status(200).send(pollApiResponse);
  }
}
