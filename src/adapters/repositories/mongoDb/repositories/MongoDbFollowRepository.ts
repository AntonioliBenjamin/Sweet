import {Followed} from "../../../../core/Entities/Followed";
import {FollowedRepository} from "../../../../core/repositories/FollowedRepository";
import {MongoDbFollowMapper} from "../mappers/MongoDbFollowMapper";
import {FollowModel} from "../models/follow";

const followMapper = new MongoDbFollowMapper();

export class MongoDbFollowRepository implements FollowedRepository {
    async create(input: Followed): Promise<Followed> {
        const follow = followMapper.fromDomain(input);
        const friendShipModel = new FollowModel(follow);
        await friendShipModel.save();
        return input;
    }

    async getFollowByUsersId(addedBy: string, userId: string): Promise<Followed> {
        const follow = await FollowModel.findOne({
            addedBy: addedBy,
            userId: userId,
        });
        if (!follow) {
            return null;
        }
        return followMapper.toDomain(follow);
    }

    async getFollowersByUserId(userId: string): Promise<string[]> {
        const friendShipsModel = await FollowModel.find({userId: userId});
        const result = friendShipsModel.map((elm) => followMapper.toDomain(elm));
        return result.map((elm) => elm.props.addedBy);
    }

    async getFollowingsByUserId(userId: string): Promise<string[]> {
        const friendShipsModel = await FollowModel.find({addedBy: userId});
        const result = friendShipsModel.map((elm) => followMapper.toDomain(elm));
        return result.map((elm) => elm.props.userId);
    }

    async getById(followId: string): Promise<Followed> {
        const follow = await FollowModel.findOne({id: followId});
        if (!follow) {
            return null;
        }
        return followMapper.toDomain(follow);
    }

    async delete(FollowId: string): Promise<void> {
        await FollowModel.deleteOne({id: FollowId});
        return;
    }

    async deleteAllByUserId(id: string): Promise<void> {
        await FollowModel.deleteMany({userId: id, addedBy: id});
        return;
    }

    async exists(userId: string, addedBy: string): Promise<Followed> {
    const follow = await FollowModel.findOne({
      userId: userId,
      addedBy: addedBy
    });
    
    if (!follow) {
      return null;
    }
    return followMapper.toDomain(follow);
    }

    async getMyFollows(userId: string): Promise<Followed[]> {
    const followsModels = await FollowModel.find({ addedBy: userId });
    if (!followsModels) {
      return null;
    }
    return followsModels.map((elm) => followMapper.toDomain(elm));
    }
}