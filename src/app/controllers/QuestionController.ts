import 'reflect-metadata';
import { Response } from "express";
import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Res,
  UseBefore,
} from "routing-controllers";
import { authorization } from "../middlewares/JwtAuthorizationMiddleware";
import { CreateQuestion } from "../../core/usecases/question/CreateQuestion";
import { GetAllQuestions } from "../../core/usecases/question/GetAllQuestions";
import { QuestionApiResponse } from "../dtos/QuestionApiResponse";
import { CreateQuestionCommands } from "../commands/question/CreateQuestionCommands";
import { DeleteQuestion } from "../../core/usecases/question/DeleteQuestion";
import { injectable } from 'inversify';

@injectable()
@JsonController("/question")
@UseBefore(authorization)
export class QuestionController {
  constructor(
    private readonly _createQuestion : CreateQuestion,
    private readonly _getAllQuestions : GetAllQuestions,
    private readonly _deleteQuestion : DeleteQuestion,
    private readonly _apiQuestionMapper : QuestionApiResponse
  ) {}

  @Post()
  async createQuestion(
    @Res() res: Response,
    @Body() cmd: CreateQuestionCommands
  ) {
    const body = await CreateQuestionCommands.setProperties(cmd);
    const question = await this._createQuestion.execute(body);
    return res.status(201).send(this._apiQuestionMapper.fromDomain(question));
  }

  @Get('/all')
  async getAllQuestions(@Res() res: Response) {
    const questions = await this._getAllQuestions.execute();

    return res.status(200).send(questions.map((elm) => elm.props));
  }

  @Delete('/:questionId')
  async deleteQuestion(
    @Res() res: Response,
    @Param("questionId") questionId: string
  ) {
    console.log(questionId)
    await this._deleteQuestion.execute(questionId);

    return res.sendStatus(200);
  }
}
