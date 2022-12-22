import mongoose from "mongoose";
import {v4} from "uuid";
import {Poll} from "../../core/Entities/Poll";
import {MongoDbPollRepository} from "../repositories/mongoDb/repositories/MongoDbPollRepository";
import {PollModel} from "../repositories/mongoDb/models/poll";
import {questionFixtures} from "../../core/fixtures/questionFixtures";

describe('Integration - MongoDbPollRepository', () => {
    let mongoDbPollRepository: MongoDbPollRepository;
    let poll: Poll;
    let poll2: Poll;
    let result: Poll;

    beforeAll(async () => {
        const databaseId = v4();
        mongoose.set('strictQuery', false)
        mongoose.connect(`mongodb://127.0.0.1:27017/${databaseId}`, (err) => {
            if (err) {
                throw err;
            }
            console.info("Connected to mongodb");
        });

        mongoDbPollRepository = new MongoDbPollRepository();

        poll = Poll.create({
            pollId: "1234"
        });

    poll2 = Poll.create({
      pollId: "5678",
    });
  });

  beforeEach(async () => {
    result = await mongoDbPollRepository.create(poll);
  });

  afterEach(async () => {
    await PollModel.collection.drop();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

    it("Should get all polls", async () => {
        await mongoDbPollRepository.create(poll2);
        const array = await mongoDbPollRepository.getAllPolls();

        expect(array).toHaveLength(2);
    });
    it("Should save a poll", () => {
        expect(result.props.createdAt).toBeTruthy();
    });

    it("Should get poll by Id", async () => {
        result = await mongoDbPollRepository.getByPollId("1234");

        expect(result.props.pollId).toEqual("1234");
    })

    it("Should update poll with questions", async () => {
        poll.props.questions = questionFixtures;
        result = await mongoDbPollRepository.update(poll);

        expect(result.props.questions).toHaveLength(12);
    })
});
