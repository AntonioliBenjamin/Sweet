import { Followed } from "../../../../core/Entities/Followed";
import { FollowedRepository } from "../../../../core/repositories/FollowedRepository";;
import { MongoDbFollowMapper } from "../mappers/MongoDbFollowMapper";
import { FollowModel } from "../models/follow";
const friendsMapper = new MongoDbFollowMapper();

export class MongoDbFollowRepository implements FollowedRepository {
  async create(input: Followed): Promise<Followed> {
    const follow = friendsMapper.fromDomain(input);
    const friendShipModel = new FollowModel(follow);
    await friendShipModel.save();
    return input;
  }

  async getFollowByUsersId(
    addedBy: string,
    userId: string
  ): Promise<Followed> {
    const follow = await FollowModel.findOne({
      addedBy: addedBy,
      userId: userId,
    });
    if (!follow) {
      return null;
    }
    return friendsMapper.toDomain(follow);
  }

  async getFollowersByUsersId(userId: string): Promise<Followed[]> {
    const friendShipsModel = await FollowModel.find({});
    const follows = friendShipsModel.filter(
      (elm) => elm.addedBy === userId || elm.userId === userId
    );
    return follows.map((elm) => friendsMapper.toDomain(elm));
  }

  async getById(FriendShipId: string): Promise<Followed> {
    const follow = await FollowModel.findOne({ id: FriendShipId });
    if (!follow) {
      return null;
    }
    return friendsMapper.toDomain(follow);
  }

  async delete(FollowId: string): Promise<void> {
    await FollowModel.deleteOne({ id: FollowId });
    return;
  }

  async deleteAllByUserId(id: string): Promise<void> {
    await FollowModel.deleteMany({ userId: id, addedBy : id });
    return;
  }
}

