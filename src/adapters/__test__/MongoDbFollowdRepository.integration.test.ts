import 'reflect-metadata';
import {Followed} from "../../core/Entities/Followed";
import {MongoDbFollowRepository} from "../repositories/mongoDb/repositories/MongoDbFollowRepository";
import {connectDB, dropCollections, dropDB} from "./setupTestDb";

describe("Integration - MongoDbFriendShipRepository", () => {
    let mongoDbFollowRepository: MongoDbFollowRepository;
    let follow: Followed;
    let friendShip2: Followed;

    beforeAll(async () => {
        await connectDB();

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
        await dropCollections();
    });

    afterAll(async () => {
        await dropDB();
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

    it("should get my follows", async () => {
        const result = await mongoDbFollowRepository.getMyFollows("ben");
        expect(result).toHaveLength(1);
    })

    it("should get follow by id", async () => {
        const result = await mongoDbFollowRepository.getById("12345");
        expect(result.props.userId).toEqual("cedric");
    })

    it("should delete follow by userId and addedBy", async () => {
        await mongoDbFollowRepository.delete("cedric", "chalom");
        const result = await mongoDbFollowRepository.getById("12345");
        expect(result).toBeFalsy();
    })

    it("should return followed if exist", async () => {
        const result = await mongoDbFollowRepository.exists("cedric", "ben")
        expect(result).toBeTruthy()
    })

    it("should return null if follow dosen't exist", async () => {
        const result = await mongoDbFollowRepository.getById("fake id");
        expect(result).toEqual(null)
    })
})