import { Poll } from "../../core/Entities/Poll";
import { Question } from "../../core/Entities/Question";

export type PollQuestionApiResponse = {
  questionId: string;
  description: string;
  picture: string;
  index: number;
};

export type PollApiResponse = {
  pollId: string;
  questions?: Array<PollQuestionApiResponse>;
  createdAt: Date;
  expirationDate: Date;
  lastQuestionAnswered: Question;
};

export class PollApiMapper {
  fromDomain(data: Poll, lastQuestionAnswered: Question): PollApiResponse {
    const questions = data.props.questions.map((elm, index) => {
      return {
        questionId: elm.questionId,
        description: elm.description,
        picture: elm.picture,
        index: index + 1,
      };
    });

    return {
      pollId: data.props.pollId,
      questions: questions,
      createdAt: data.props.createdAt,
      expirationDate: data.props.expirationDate,
      lastQuestionAnswered: lastQuestionAnswered,
    };
  }
}
