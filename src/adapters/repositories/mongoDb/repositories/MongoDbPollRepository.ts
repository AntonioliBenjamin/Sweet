import { Poll } from "../../../../core/Entities/Poll";
import { PollModel } from "../models/poll";
import { MongoDbPollMapper } from "../mappers/MongoDbPollMapper";
import { PollRepository } from "../../../../core/repositories/PollRepository";
import { PollErrors } from "../../../../core/errors/PollErrors";


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

  async getByPollId(pollId: string): Promise<Poll> {
    const poll = await PollModel.findOne({ pollId: pollId });
    if (!poll) {
      throw new PollErrors.NotFound();
    }
    return mongoDbPollMapper.toDomain(poll);
  }

  async update(poll: Poll): Promise<Poll> {
    const toPollModel = mongoDbPollMapper.fromDomain(poll);
    await PollModel.findOneAndUpdate(
      { id: toPollModel.pollId },
      {
        $set: {
          questions: toPollModel.questions,
        },
      },
      { new: true }
    );
    return poll;
  }
}
