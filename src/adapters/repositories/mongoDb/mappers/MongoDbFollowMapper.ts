import { Followed } from "../../../../core/Entities/Followed";
import { Mapper } from "../../../../core/models/Mapper";
import {FollowModel} from "../models/follow";

export class MongoDbFollowMapper implements Mapper<FollowModel, Followed> {
    toDomain(raw: FollowModel): Followed {
        return new Followed({
            id: raw.id,
            senderId: raw.senderId,
            recipientId: raw.recipientId,
           
        })
    }

    fromDomain(data: Followed): FollowModel {
        return {
            id: data.props.id,
            recipientId: data.props.recipientId,
            senderId: data.props.senderId
        }
    }
}