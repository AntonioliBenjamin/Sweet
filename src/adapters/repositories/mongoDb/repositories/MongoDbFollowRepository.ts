import { Followed } from "../../../../core/Entities/Followed";
import { FollowErrors } from "../../../../core/errors/FollowErrors";
import { FollowedRepository } from "../../../../core/repositories/FollowedRepository";
import { MongoDbFollowMapper } from "../mappers/MongoDbFollowMapper";
import { FollowModel } from "../models/follow";
const friendsMapper = new MongoDbFollowMapper();

export class MongoDbFriendShiprepository implements FollowedRepository {
  async create(input: Followed): Promise<Followed> {
    const friendShip = friendsMapper.fromDomain(input);
    const friendShipModel = new FollowModel(friendShip);
    await friendShipModel.save();
    return input;
  }

  async getFollowByUsersId(
    senderId: string,
    recipientId: string
  ): Promise<Followed> {
    const friendShip = await FollowModel.findOne({
      senderId: senderId,
      recipientId: recipientId
    });
    if(!friendShip) {
      return null;
    }
    return friendsMapper.toDomain(friendShip);
  }

  async getFollowersByUsersId(userId: string): Promise<Followed[]> {
    const friendShipsModel = await FollowModel.find({});
    const friendShips = friendShipsModel.filter(
      (elm) => elm.senderId === userId || elm.recipientId === userId
    );
    return friendShips.map((elm) => friendsMapper.toDomain(elm));
  }

  async getById(FriendShipId: string): Promise<Followed> {
    const friendShip = await FollowModel.findOne({ id: FriendShipId });
    if (!friendShip) {
      return null;
    }
    return friendsMapper.toDomain(friendShip);
  }

  async delete(FollowId: string): Promise<void> {
    await FollowModel.deleteOne({ id: FollowId });
    return;
  }
}
