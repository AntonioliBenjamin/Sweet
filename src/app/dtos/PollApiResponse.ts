import { Answer } from "../../core/Entities/Answer";
import { Poll } from "../../core/Entities/Poll";
import moment from "moment";

export type PollQuestionApiResponse = {
  id: string;
  description: string;
  picture: string;
  index: number;
};

export type PollApiResponseProperties = {
  id: string;
  questions?: Array<PollQuestionApiResponse>;
  createdAt: Date;
  expirationDate: Date;
  lastQuestionAnswered?: PollQuestionApiResponse;
  currentQuestion: PollQuestionApiResponse;
  isFinished: boolean;
};

export class PollApiResponse {
  fromDomain(data: Poll, lastQuestionAnswered: Answer): PollApiResponseProperties {
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
      expirationDate: moment(data.props.expirationDate).add(1, 'minutes').toDate(),
      currentQuestion: currentQuestion,
      isFinished: isFinished
    };
  }
}