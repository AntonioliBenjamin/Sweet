import { UseCase } from "../Usecase";
import { Answer } from "../../Entities/Answer";
import { IdGateway } from "../../gateways/IdGateway";
import { AnswerRepository } from "../../repositories/AnswerRepository";
import { UserRepository } from "../../repositories/UserRepository";
import { QuestionRepository } from "../../repositories/QuestionRepository";

export type AnswerToQuestionInput = {
  questionId: string;
  answerUserId: string;
  userId: string;
};

export class AnswerToQuestion
  implements UseCase<AnswerToQuestionInput, Answer>
{
  constructor(
    private readonly answerRepository: AnswerRepository,
    private readonly userRepository: UserRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly idGateway: IdGateway
  ) {}

  async execute(input: AnswerToQuestionInput): Promise<Answer> {
    const user = await this.userRepository.getById(input.userId);
    
    const question = await this.questionRepository.getByQuestionId(
      input.questionId
    );

    const id = this.idGateway.generate();

    const answer = Answer.create({
      answer: input.answerUserId,
      answerId: id,
      question: {
        description: question.props.description,
        picture: question.props.picture,
        questionId: question.props.questionId,
      },
      response: {
        firstName: user.props.firstName,
        gender: user.props.gender,
        lastName: user.props.lastName,
        schoolId: user.props.schoolId,
        section: user.props.schoolId,
        userId: user.props.id,
        userName: user.props.userName,
      },
    });

    return await this.answerRepository.create(answer);
  }
}
