import { Answer } from "../../../../core/Entities/Answer";
import { Mapper } from "../../../../core/models/Mapper";
import { AnswerModel } from "../models/answer";

export class MongoDbAnswerMapper implements Mapper<AnswerModel, Answer> {
  toDomain(raw: AnswerModel): Answer {
    return new Answer({
      userId: raw.userId,
      answerId: raw.answerId,
      createdAt: new Date(raw.createdAt),
      question: raw.question,
      response: raw.response,
      markAsRead : raw.markAsRead,
      pollId: raw.pollId,
      from: raw.from,
    });
  }

  fromDomain(data: Answer): AnswerModel {
    return {
      userId: data.props.userId,
      answerId: data.props.answerId,
      createdAt: +data.props.createdAt,
      question: data.props.question,
      response: data.props.response,
      markAsRead : data.props.markAsRead,
      pollId: data.props.pollId,
      from: data.props.from,
    };
  }
}
