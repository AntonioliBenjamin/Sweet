import { Answer } from "../../core/Entities/Answer";
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
  lastQuestionAnswered?: PollQuestionApiResponse;
};

export class PollApiMapper {
  fromDomain(data: Poll, lastQuestionAnswered: Answer): PollApiResponse {
    const questions = data.props.questions.map((elm, index) => {
      return {
        questionId: elm.questionId,
        description: elm.description,
        picture: elm.picture,
        index: index + 1,
      };
    });

    const lastQuestion = questions.find(elm => elm.questionId === lastQuestionAnswered?.props.question.questionId )

    return {
      pollId: data.props.pollId,
      questions: questions,
      createdAt: data.props.createdAt,
      expirationDate: data.props.expirationDate,
      lastQuestionAnswered: lastQuestion ?? null
    };
  }
}
