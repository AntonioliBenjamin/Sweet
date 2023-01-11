import 'reflect-metadata';
import { Get, Res, UseBefore, Req, Controller } from "routing-controllers";
import { Response } from "express";
import { authorization } from "../middlewares/JwtAuthorizationMiddleware";
import { AuthentifiedRequest } from "../types/AuthentifiedRequest";
import { GetAllPolls } from "../../core/usecases/poll/GetAllPolls";
import { GetCurrentPoll } from "../../core/usecases/poll/GetCurrentPoll";
import { GetLastQuestionAnswered } from "../../core/usecases/answer/GetLastQuestionAnswered";
import { PollApiResponse } from "../dtos/PollApiResponse";
import { injectable } from 'inversify';

@injectable()
@Controller('/poll')
@UseBefore(authorization)
export class PollController {
  constructor(
    private readonly _getAllPolls : GetAllPolls,
    private readonly _getCurrentPoll : GetCurrentPoll,
    private readonly _getLastQuestionAnswered : GetLastQuestionAnswered,
    private readonly _pollApiResponse : PollApiResponse
  ) {}
    
  @Get('/all')
  async getAllPolls(@Res() res: Response) {
    const polls = await this._getAllPolls.execute();
    return res.status(200).send(polls.map((elm) => elm.props));
  }

  @Get("/current")
  async getCurentPoll(@Res() res: Response, @Req() req: AuthentifiedRequest) {
    const currentPoll = await this._getCurrentPoll.execute();

    const lastAnswer = await this._getLastQuestionAnswered.execute({
      pollId: currentPoll.props.pollId,
      userId: req.user.id,
    });

    const pollApiResponse = this._pollApiResponse.fromDomain(currentPoll, lastAnswer);

    return res.status(200).send(pollApiResponse);
  }
}
