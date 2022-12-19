import mongoose from "mongoose";
import { v4 } from "uuid"
import { Followed } from "../../core/Entities/Followed";
import { FriendShipModel } from "../repositories/mongoDb/models/friendShip";
import { MongoDbFriendShiprepository } from "../repositories/mongoDb/repositories/MongoDbFollowRepository";


describe("Integration - MongoDbFriendShipRepository", () => {

    let mongoDbFriendShiprepository: MongoDbFriendShiprepository
    let friendShip: Followed;
    let friendShip2: Followed;

    beforeAll(async () => {
        mongoDbFriendShiprepository = new MongoDbFriendShiprepository()

        const databaseId = v4();
        mongoose.connect(`mongodb://127.0.0.1:27017/${databaseId}`, (err) => {
          if (err) {
            throw err;
          }
          console.info("Connected to mongodb");
        });

        friendShip = Followed.create({
            id: "12345",
            recipientId: "0000",
            senderId: "1111"
        })

        friendShip2 = Followed.create({
            id: "54321",
            recipientId: "5555",
            senderId: "1111"
        })
      });
    
        beforeEach(async () => {
          await mongoDbFriendShiprepository.create(friendShip);
          await mongoDbFriendShiprepository.create(friendShip2);
        });
    
        afterEach(async () => {
          await FriendShipModel.collection.drop();
        });
    
        afterAll(async () => {
          await mongoose.connection.dropDatabase();
          await mongoose.connection.close();
        });
    
    it("should save a friendShip", async () => {
        const result = await mongoDbFriendShiprepository.create( new Followed({
            id: "99999",
            recipientId: "5555",
            senderId: "1111"
        }))
        expect(result.props.id).toEqual("99999")
        expect(result.props.recipientId).toEqual("5555")
    })

    it("should get friendShip by users Id", async () => {
        const result = await mongoDbFriendShiprepository.getFollowByUsersId(friendShip.props.senderId, friendShip.props.recipientId)
        expect(result.props.id).toEqual("12345")
    })

    it("should get all friendShips by userId", async () => {
        const result = await mongoDbFriendShiprepository.getFollowersByUsersId("1111");
        expect(result).toHaveLength(2)
    })

    it("should get friendShip by id", async () => {
        const result = await mongoDbFriendShiprepository.getById("12345")
        expect(result.props.recipientId).toEqual("0000")
    })

    it("should delete friendShip by Id", async () => {
        await mongoDbFriendShiprepository.delete("12345")
        const result = await mongoDbFriendShiprepository.getById("12345")
        expect(result).toBeFalsy()
    })
})