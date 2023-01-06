import { Mapper } from "../../../../core/models/Mapper";
import { Question } from "../../../../core/Entities/Question";
import { questionModel } from "../models/question";

export class MongoDbQuestionMapper implements Mapper<questionModel, Question> {
  fromDomain(data: Question): questionModel {
    return {
      description: data.props.description,
      picture: data.props.picture,
      questionId: data.props.questionId,
    };
  }

  toDomain(raw: questionModel): Question {
    return new Question({
      description: raw.description,
      picture: raw.picture,
      questionId: raw.questionId,
    });
  }
}
