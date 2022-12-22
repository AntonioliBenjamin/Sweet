import mongoose from "mongoose";
import {v4} from "uuid";
import {Followed} from "../../core/Entities/Followed";
import {FollowModel} from "../repositories/mongoDb/models/follow";
import {MongoDbFollowRepository} from "../repositories/mongoDb/repositories/MongoDbFollowRepository";

describe("Integration - MongoDbFriendShipRepository", () => {
    let mongoDbFollowRepository: MongoDbFollowRepository;
    let follow: Followed;
    let friendShip2: Followed;

    beforeAll(async () => {
        const databaseId = v4();
        mongoose.connect(`mongodb://127.0.0.1:27017/${databaseId}`, (err) => {
            if (err) {
                throw err;
            }
            console.info("Connected to mongodb");
        });

        mongoDbFollowRepository = new MongoDbFollowRepository();

        follow = Followed.create({
            id: "12345",
            userId: "cedric",
            addedBy: "chalom"
        })

        friendShip2 = Followed.create({
            id: "54321",
            userId: "cedric",
            addedBy: "ben"
        })
    });

    beforeEach(async () => {
        await mongoDbFollowRepository.create(follow);
        await mongoDbFollowRepository.create(friendShip2);
    });

    afterEach(async () => {
        await FollowModel.collection.drop();
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it("should save a follow", async () => {
        const result = await mongoDbFollowRepository.create(new Followed({
            id: "99999",
            userId: "5555",
            addedBy: "1111"
        }))

        expect(result.props.id).toEqual("99999");
        expect(result.props.userId).toEqual("5555");
    })

    it("should get follow by users Id", async () => {
        const result = await mongoDbFollowRepository.getFollowByUsersId(follow.props.addedBy, follow.props.userId);

        expect(result.props.id).toEqual("12345");
    })

    it("should get followers by userId", async () => {
        const result = await mongoDbFollowRepository.getFollowersByUserId("cedric");

        expect(result).toHaveLength(2);
    })

    it("should get followings by userId", async () => {
        const result = await mongoDbFollowRepository.getFollowingsByUserId("ben");

        expect(result).toHaveLength(1);
    })

    it("should get follow by id", async () => {
        const result = await mongoDbFollowRepository.getById("12345");

        expect(result.props.userId).toEqual("cedric");
    })

    it("should delete follow by Id", async () => {
        await mongoDbFollowRepository.delete("12345");
        const result = await mongoDbFollowRepository.getById("12345");

        expect(result).toBeFalsy();
    })
})