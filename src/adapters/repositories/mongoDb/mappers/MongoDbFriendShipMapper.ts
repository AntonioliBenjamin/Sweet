import { Followed } from "../../../../core/Entities/Followed";
import { Mapper } from "../../../../core/models/Mapper";
import { FriendShipModel } from "../models/friendShip";

export class MongoDbFriendShipMapper implements Mapper<FriendShipModel, Followed> {
    toDomain(raw: FriendShipModel): Followed {
        return new Followed({
            id: raw.id,
            senderId: raw.senderId,
            recipientId: raw.recipientId,
           
        })
    }

    fromDomain(data: Followed): FriendShipModel {
        return {
            id: data.props.id,
            recipientId: data.props.recipientId,
            senderId: data.props.senderId
        }
    }
}