import 'reflect-metadata';
import { Param, Get, Post, Res, Body, UseBefore, Req, JsonController, Delete, Patch } from "routing-controllers";
import { Response } from "express";
import { AnswerMarkAsRead } from "../../core/usecases/answer/AnswerMarkAsRead";
import { DeleteAnswer } from "../../core/usecases/answer/DeleteAnswer";
import { GetMyAnswers } from "../../core/usecases/answer/GetMyAnswers";
import { GetAllAnswers } from "../../core/usecases/answer/GetAllAnswers";
import { AnswerToQuestion } from "../../core/usecases/answer/AnswerToQuestion";
import { AnswerToQuestionCommands } from "../commands/answer/AnswerToQuestionCommands";
import { authorization } from "../middlewares/JwtAuthorizationMiddleware";
import { AuthentifiedRequest } from "../types/AuthentifiedRequest";
import {injectable} from "inversify";
import { GetLastQuestionAnswered } from '../../core/usecases/answer/GetLastQuestionAnswered';

@injectable()
@JsonController('/answer')
@UseBefore(authorization)
export class AnswerController {
  constructor(
      private readonly _answerMarkAsRead: AnswerMarkAsRead,
      private readonly _answerToQuestion : AnswerToQuestion,
      private readonly _deleteAnswer: DeleteAnswer,
      private readonly _getAllAnswers: GetAllAnswers,
      private readonly _getLastQuestionAnswered : GetLastQuestionAnswered,
      private readonly _getMyAnswers : GetMyAnswers
  ){}

  @Post()
  async answerToQuestion(
    @Res() res: Response,
    @Body() cmd: AnswerToQuestionCommands) {

    const body = await AnswerToQuestionCommands.setProperties(cmd)
    const answer = await this._answerToQuestion.execute(body)
    return res.status(201).send(answer.props);
  }
  
  @Get('/all/:schoolId')
  async getAllAnswers(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param("schoolId") schoolId: string
  ) {

    const answers = await this._getAllAnswers.execute({
        schoolId: schoolId,
        userId: req.user.id,
    });

    return res.status(200).send(answers.map(item => item.props));
  }

  @Get('/mine')
  async getMyAnswers(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response
  ) {
    const answers = await this._getMyAnswers.execute(req.user.id)

    return res.status(200).send(answers.map(item => item.props));
  }
  
  @Delete('/:answerId')
  async deleteAnswer(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param("answerId") answerId: string
  ) {

    await this._deleteAnswer.execute(answerId);

    return res.sendStatus(200);
  }

  @Patch('/:answerId')
  async answerMarkAsRead(
    @Res() res: Response,
    @Param("answerId") answerId: string
  ) {

    await this._answerMarkAsRead.execute(answerId);

    return res.sendStatus(200);
  }
}
