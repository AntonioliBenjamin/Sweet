import {Mapper} from "../../../../core/models/Mapper";
import {Question} from "../../../../core/Entities/Question";
import {questionModel} from "../models/question";

export class MongoDbQuestionMapper implements Mapper<questionModel, Question> {
    fromDomain(data: Question): questionModel {
        const {
            questionId,
            description,
            picture

        } = data.props;
        return {
            questionId,
            description,
            picture
        }
    }

    toDomain(raw: questionModel): Question {
        const {
            questionId,
            description,
            picture
        } = raw;
        return new Question({
            questionId,
            description,
            picture
        });
    }
}