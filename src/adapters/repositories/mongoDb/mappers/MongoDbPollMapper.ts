import {Mapper} from "../../../../core/models/Mapper";
import {Poll} from "../../../../core/Entities/Poll";
import {pollModel} from "../models/poll";

export class MongoDbPollMapper implements Mapper<pollModel, Poll> {
    fromDomain(data: Poll): pollModel {
        const {
            pollId,
            createdAt,
            questions
        } = data.props;
        return {
            pollId,
            createdAt: +createdAt,
            questions
        }
    }

    toDomain(raw: pollModel): Poll {
        const {
            pollId,
            createdAt,
            questions
        } = raw;
        return new Poll({
            pollId,
            createdAt: new Date(createdAt),
            questions
        });
    }
}