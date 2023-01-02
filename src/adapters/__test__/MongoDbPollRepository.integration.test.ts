import mongoose from "mongoose";
import {v4} from "uuid";
import {Poll} from "../../core/Entities/Poll";
import {MongoDbPollRepository} from "../repositories/mongoDb/repositories/MongoDbPollRepository";
import {PollModel} from "../repositories/mongoDb/models/poll";

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

        poll =new Poll({
            pollId: "1234",
            createdAt : new Date(1),
            expirationDate : new Date(new Date(1).setHours(new Date(1).getHours()+1)),
        });

        poll2 =new Poll({
            pollId: "5678",
            createdAt : new Date(),
            expirationDate : new Date(new Date().setHours(new Date().getHours()+1)),
        });
    });

    beforeEach(async () => {
        result = await mongoDbPollRepository.create(poll);
        await mongoDbPollRepository.create(poll2);

    });

    afterEach(async () => {
        await PollModel.collection.drop();
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });


    it("Should get all polls", async () => {
        const array = await mongoDbPollRepository.getAllPolls();

        expect(array).toHaveLength(2);
    });

    it("Should get most recent poll", async () => {
        const result = await mongoDbPollRepository.getCurrentPoll()
        expect(result.props.pollId).toEqual("5678");
    });

    it("Should save a poll", () => {
        expect(result.props.createdAt).toBeTruthy();
        expect(result.props.expirationDate).toBeTruthy();
    });

    it("should delete a poll", async () => {
        const result = await mongoDbPollRepository.delete(poll.props.pollId);

        expect(result).toBeFalsy();
        await expect(PollModel.findOne({ pollId: poll.props.pollId })).resolves.toEqual(null);
    });
});
