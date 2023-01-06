import {Poll} from "../../../../core/Entities/Poll";
import {PollModel} from "../models/poll";
import {MongoDbPollMapper} from "../mappers/MongoDbPollMapper";
import {PollRepository} from "../../../../core/repositories/PollRepository";

export const mongoDbPollMapper = new MongoDbPollMapper();

export class MongoDbPollRepository implements PollRepository {
    async create(poll: Poll): Promise<Poll> {
        const toPollModel = mongoDbPollMapper.fromDomain(poll);
        const pollModel = new PollModel(toPollModel);
        await pollModel.save();
        return poll;
    }

    async getAllPolls(): Promise<Poll[]> {
        const polls = await PollModel.find();
        return polls.map((elm) => mongoDbPollMapper.toDomain(elm));
    }

    async getCurrentPoll(input: void): Promise<Poll> {
        const pollModel = await PollModel.find().sort({createdAt: -1})
        return mongoDbPollMapper.toDomain(pollModel[0]);
    }

    async delete(pollId: string): Promise<void> {
        await PollModel.deleteOne({pollId: pollId});
        return;
    }
}
