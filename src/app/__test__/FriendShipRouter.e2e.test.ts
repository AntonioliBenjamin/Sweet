import "dotenv/config";
import { friendShipRouter } from "../routes/friendShip";
import supertest from "supertest";
import mongoose from "mongoose";
import { v4 } from "uuid";
import { sign } from "jsonwebtoken";
import express from "express";
import { MongoDbUserRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";
import { Gender, User } from "../../core/Entities/User";
import { UserRepository } from "../../core/repositories/UserRepository";
import { FriendShipRepository } from "../../core/repositories/FriendShipRepository";
import { MongoDbFriendShiprepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbFriendShipRepository";
import { UserModel } from "../../adapters/repositories/mongoDb/models/user";
import { FriendShipModel } from "../../adapters/repositories/mongoDb/models/friendShip";

const app = express();

describe("E2E - FriendShipRouter", () => {
  let accessKey;
  let userRepository: UserRepository;
  let friendShipRepository: FriendShipRepository;
  let user: User;
  let user2: User;

  beforeAll(() => {
    userRepository = new MongoDbUserRepository();
    friendShipRepository = new MongoDbFriendShiprepository();

    app.use(express.json());
    app.use("/friend", friendShipRouter);

    const databaseId = v4();
    mongoose.set("strictQuery", false);
    mongoose.connect(`mongodb://127.0.0.1:27017/${databaseId}`, (err) => {
      if (err) {
        throw err;
      }
      console.info("Connected to mongodb");
    });

    user = User.create({
      email: "user@example.com",
      id: "8888",
      password: "password",
      userName: "user Name",
      age: 15,
      firstName: "michou",
      gender: Gender.BOY,
      lastName: "papito",
      schoolId: "456",
      section: "cp",
    });

    user2 = User.create({
      email: "pollicr@example.com",
      id: "9999",
      password: "jkhfsdkjhfkjs",
      userName: "user Name2",
      age: 15,
      firstName: "denis",
      gender: Gender.BOY,
      lastName: "polllich",
      schoolId: "456",
      section: "cp",
    });
  });

  beforeEach(async() => {
   await userRepository.create(user);
    await userRepository.create(user2);
  })

  afterEach(async () => {
    await UserModel.collection.drop();
    await FriendShipModel.collection.drop();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should post/friend/add", async () => {
    accessKey = sign(
        {
            id: user.props.id,
            schoolId: user.props.schoolId
        },
        "maytheforcebewithyou" 
    );
    
    await supertest(app)
        .post("/friend/add")
        .set("access_key", accessKey)
        .send({
            senderId: user.props.id,
            recipientId: user2.props.id
        })

        .expect((response) => {
            //  console.log(response)
            const responseBody = response.body;
            expect(responseBody).toBeTruthy
        })
        .expect(201)
  })
});
