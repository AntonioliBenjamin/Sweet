import { Mapper } from "../../../../core/models/Mapper";
import { Poll } from "../../../../core/Entities/Poll";
import { pollModel } from "../models/poll";

export class MongoDbPollMapper implements Mapper<pollModel, Poll> {
  fromDomain(data: Poll): pollModel {
    return {
      pollId: data.props.pollId,
      createdAt: +data.props.createdAt,
      expirationDate : +data.props.expirationDate,
      questions: data.props.questions,
    };
  }

  toDomain(raw: pollModel): Poll {
    return new Poll({
      pollId: raw.pollId,
      questions: raw.questions,
      createdAt: new Date(raw.createdAt),
      expirationDate : new Date(raw.expirationDate)
    });
  }
}
