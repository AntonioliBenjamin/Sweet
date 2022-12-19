import { Followed } from "../../../../core/Entities/Followed";
import { FollowErrors } from "../../../../core/errors/FollowErrors";
import { FollowedRepository } from "../../../../core/repositories/FollowedRepository";
import { MongoDbFriendShipMapper } from "../mappers/MongoDbFriendShipMapper";
import { FriendShipModel } from "../models/friendShip";
const friendsMapper = new MongoDbFriendShipMapper();

export class MongoDbFriendShiprepository implements FollowedRepository {
  async create(input: Followed): Promise<Followed> {
    const friendShip = friendsMapper.fromDomain(input);
    const friendShipModel = new FriendShipModel(friendShip);
    await friendShipModel.save();
    return input;
  }

  async getFollowByUsersId(
    senderId: string,
    recipientId: string
  ): Promise<Followed> {
    const friendShip = await FriendShipModel.findOne({
      senderId: senderId,
      recipientId: recipientId
    });
    if(!friendShip) {
      return null;
    }
    return friendsMapper.toDomain(friendShip);
  }

  async getFollowersByUsersId(userId: string): Promise<Followed[]> {
    const friendShipsModel = await FriendShipModel.find({});
    const friendShips = friendShipsModel.filter(
      (elm) => elm.senderId === userId || elm.recipientId === userId
    );
    return friendShips.map((elm) => friendsMapper.toDomain(elm));
  }

  async getById(FriendShipId: string): Promise<Followed> {
    const friendShip = await FriendShipModel.findOne({ id: FriendShipId });
    if (!friendShip) {
      return null;
    }
    return friendsMapper.toDomain(friendShip);
  }

  async delete(FollowId: string): Promise<void> {
    await FriendShipModel.deleteOne({ id: FollowId });
    return;
  }
}
