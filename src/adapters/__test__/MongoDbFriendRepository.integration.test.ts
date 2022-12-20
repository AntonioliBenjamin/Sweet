import mongoose from "mongoose";
import { v4 } from "uuid"
import { Followed } from "../../core/Entities/Followed";
import { FollowModel } from "../repositories/mongoDb/models/follow";
import { MongoDbFollowRepository } from "../repositories/mongoDb/repositories/MongoDbFollowRepository";


describe("Integration - MongoDbFriendShipRepository", () => {

    let mongoDbFollowRepository: MongoDbFollowRepository
    let follow: Followed;
    let friendShip2: Followed;

    beforeAll(async () => {
        mongoDbFollowRepository = new MongoDbFollowRepository()

        const databaseId = v4();
        mongoose.connect(`mongodb://127.0.0.1:27017/${databaseId}`, (err) => {
            if (err) {
                throw err;
            }
            console.info("Connected to mongodb");
        });

        follow = Followed.create({
            id: "12345",
            userId: "0000",
            addedBy: "1111"
        })

        friendShip2 = Followed.create({
            id: "54321",
            userId: "5555",
            addedBy: "1111"
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
        expect(result.props.id).toEqual("99999")
        expect(result.props.userId).toEqual("5555")
    })

    it("should get follow by users Id", async () => {
        const result = await mongoDbFollowRepository.getFollowByUsersId(follow.props.addedBy, follow.props.userId)
        expect(result.props.id).toEqual("12345")
    })

    it("should get all follows by userId", async () => {
        const result = await mongoDbFollowRepository.getFollowersByUsersId("1111");
        expect(result).toHaveLength(2)
    })

    it("should get follow by id", async () => {
        const result = await mongoDbFollowRepository.getById("12345")
        expect(result.props.userId).toEqual("0000")
    })

    it("should delete follow by Id", async () => {
        await mongoDbFollowRepository.delete("12345")
        const result = await mongoDbFollowRepository.getById("12345")
        expect(result).toBeFalsy()
    })
})