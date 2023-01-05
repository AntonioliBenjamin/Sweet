import { Answer } from "../../core/Entities/Answer";
import { Poll } from "../../core/Entities/Poll";

export type PollQuestionApiResponse = {
  id: string;
  description: string;
  picture: string;
  index: number;
};

export type PollApiResponse = {
  id: string;
  questions?: Array<PollQuestionApiResponse>;
  createdAt: Date;
  expirationDate: Date;
  lastQuestionAnswered?: PollQuestionApiResponse;
  currentQuestion: PollQuestionApiResponse;
  isFinished: boolean;
};

export class PollApiMapper {
  fromDomain(data: Poll, lastQuestionAnswered: Answer): PollApiResponse {
    let currentQuestion: PollQuestionApiResponse;
    let isFinished = false;
    const questions = data.props.questions.map((elm, index) => {
      return {
        id: elm.questionId,
        description: elm.description,
        picture: elm.picture,
        index: index + 1,
      };
    });

    const lastQuestion = questions.findIndex(elm => elm.id === lastQuestionAnswered?.props.question.questionId);
    if (lastQuestion != -1) {
      const isPollFinished = questions[questions.length - 1].id === questions[lastQuestion].id;
      isFinished = isPollFinished;
      const index = isPollFinished ? lastQuestion : lastQuestion + 1
      currentQuestion = questions[index];
    } else {
      currentQuestion = questions[0];
    }

    return {
      id: data.props.pollId,
      questions: questions,
      createdAt: data.props.createdAt,
      expirationDate: data.props.expirationDate,
      currentQuestion: currentQuestion,
      isFinished: isFinished
    };
  }
}