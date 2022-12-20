import { Followed } from "../../../../core/Entities/Followed";
import { Mapper } from "../../../../core/models/Mapper";
import { FollowModel } from "../models/follow";

export class MongoDbFollowMapper implements Mapper<FollowModel, Followed> {
    toDomain(raw: FollowModel): Followed {
        return new Followed({
            id: raw.id,
            addedBy: raw.addedBy,
            userId: raw.userId,
           
        })
    }

    fromDomain(data: Followed): FollowModel {
        return {
            id: data.props.id,
            userId: data.props.userId,
            addedBy: data.props.addedBy
        }
    }
}
