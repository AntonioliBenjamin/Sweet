import { FriendShip } from "../../../../core/Entities/FriendShip";
import { FriendShipRepository } from "../../../../core/repositories/FriendShipRepository";
import { MongoDbFriendShipMapper } from "../mappers/MongoDbFriendShipMapper";
import { FriendShipModel } from "../models/friendShip";
const friendsMapper = new MongoDbFriendShipMapper();

export class MongoDbFriendShiprepository implements FriendShipRepository {
  async create(input: FriendShip): Promise<FriendShip> {
    const friendShip = friendsMapper.fromDomain(input);
    const friendShipModel = new FriendShipModel(friendShip);
    await friendShipModel.save();
    return input;
  }

  async getFriendShipByUsersId(
    senderId: string,
    recipientId: string
  ): Promise<FriendShip> {
    const friendShip = await FriendShipModel.findOne({
      senderId: senderId,
      recipientId: recipientId,
    });
    return friendsMapper.toDomain(friendShip);
  }

  async getAllFriendShipsByUserId(userId: string): Promise<FriendShip[]> {
    const friendShipsModel = await FriendShipModel.find({});
    const friendShips = friendShipsModel.filter(
      (elm) => elm.senderId === userId || elm.recipientId === userId
    );
    return friendShips.map((elm) => friendsMapper.toDomain(elm));
  }

  async getById(FriendShipId: string): Promise<FriendShip> {
    const friendShip = await FriendShipModel.findOne({ id: FriendShipId });
    if (!friendShip) {
      return null;
    }
    return friendsMapper.toDomain(friendShip);
  }

  async delete(friendShipId: string): Promise<void> {
    await FriendShipModel.deleteOne({ id: friendShipId });
    return;
  }
}
