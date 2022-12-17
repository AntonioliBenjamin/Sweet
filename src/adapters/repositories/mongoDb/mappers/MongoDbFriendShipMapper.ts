import { FriendShip } from "../../../../core/Entities/FriendShip";
import { Mapper } from "../../../../core/models/Mapper";
import { FriendShipModel } from "../models/friendShip";

export class MongoDbFriendShipMapper implements Mapper<FriendShipModel, FriendShip> {
    toDomain(raw: FriendShipModel): FriendShip {
        return new FriendShip({
            id: raw.id,
            senderId: raw.senderId,
            recipientId: raw.recipientId,
           
        })
    }

    fromDomain(data: FriendShip): FriendShipModel {
        return {
            id: data.props.id,
            recipientId: data.props.recipientId,
            senderId: data.props.senderId
        }
    }
}