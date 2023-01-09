import 'reflect-metadata';
import { Response } from "express";
import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Req,
  Res,
  UseBefore,
} from "routing-controllers";
import { AuthentifiedRequest } from "../types/AuthentifiedRequest";
import { authorization } from "../middlewares/JwtAuthorizationMiddleware";
import { MongoDbQuestionRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbQuestionRepository";
import { CreateQuestion } from "../../core/usecases/question/CreateQuestion";
import { V4IdGateway } from "../../adapters/gateways/V4IdGateway";
import { GetAllQuestions } from "../../core/usecases/question/GetAllQuestions";
import { QuestionApiResponse } from "../dtos/QuestionApiResponse";
import { CreateQuestionCommands } from "../commands/question/CreateQuestionCommands";
import { DeleteQuestion } from "../../core/usecases/question/DeleteQuestion";

const mongoDbQuestionRepository = new MongoDbQuestionRepository();
const v4IdGateway = new V4IdGateway();
const createQuestion = new CreateQuestion(
  mongoDbQuestionRepository,
  v4IdGateway
);
const getAllQuestions = new GetAllQuestions(mongoDbQuestionRepository);
const apiQuestionMapper = new QuestionApiResponse();
const deleteQuestion = new DeleteQuestion(mongoDbQuestionRepository);

@JsonController("/question")
@UseBefore(authorization)
export class QuestionController {

  @Post()
  async createQuestion(
    @Res() res: Response,
    @Req() req: AuthentifiedRequest,
    @Body() body: any
  ) {
    const value = await CreateQuestionCommands.setProperties({
      description: body.description,
      picture: body.picture,
    });

    const question = await createQuestion.execute(value);

    return res.status(201).send(apiQuestionMapper.fromDomain(question));
  }

  @Get('/all')
  async getAllQuestions(@Res() res: Response) {
    const questions = await getAllQuestions.execute();

    return res.status(200).send(questions.map((elm) => elm.props));
  }

  @Delete('/:questionId')
  async deleteQuestion(
    @Res() res: Response,
    @Param("questionId") questionId: string
  ) {
    console.log(questionId)
    await deleteQuestion.execute(questionId);

    return res.sendStatus(200);
  }
}
