import "dotenv/config";
import { friendShipRouter } from "../routes/follow";
import supertest from "supertest";
import mongoose from "mongoose";
import { v4 } from "uuid";
import { sign } from "jsonwebtoken";
import express from "express";
import { MongoDbUserRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";
import { Gender, User } from "../../core/Entities/User";
import { UserRepository } from "../../core/repositories/UserRepository";
import { FollowedRepository } from "../../core/repositories/FollowedRepository";
import { MongoDbFollowRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbFollowRepository";
import { UserModel } from "../../adapters/repositories/mongoDb/models/user";
import { FollowModel } from "../../adapters/repositories/mongoDb/models/follow";
import { Followed } from "../../core/Entities/Followed";

const app = express();

describe("E2E - FriendShipRouter", () => {
  let accessKey;
  let userRepository: UserRepository;
  let friendShipRepository: FollowedRepository;
  let user: User;
  let user2: User;
  let friendShip: Followed;
  let friendShip2: Followed

  beforeAll(() => {
    userRepository = new MongoDbUserRepository();
    friendShipRepository = new MongoDbFollowRepository();

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

    friendShip = Followed.create({
      id: "1111",
      recipientId: user2.props.id,
      senderId: user.props.id, 
    })

    friendShip2 = Followed.create({
      id: "2222",
      recipientId: user2.props.id,
      senderId: "0000", 
    })
  });

  beforeEach(async() => {
    await userRepository.create(user);
    await userRepository.create(user2);
  })

  afterEach(async () => {
    await UserModel.collection.drop();
    await FollowModel.collection.drop();
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
          recipientId: user2.props.id,
            senderId: user.props.id, 
        })

        .expect((response) => {
            const responseBody = response.body;
            expect(responseBody.senderId).toEqual("8888")
        })
        .expect(201)
  })

  it("should get/friend/all/:userId", async () => {
      await friendShipRepository.create(friendShip)
      await friendShipRepository.create(friendShip2)

      accessKey = sign(
        {
            id: user.props.id,
            schoolId: user.props.schoolId
        },
        "maytheforcebewithyou" 
    );
    
    await supertest(app)
        .get(`/friend/all/${user2.props.id}`)
        .set("access_key", accessKey)

        .expect((response) => {
            const responseBody = response.body;
            expect(responseBody).toHaveLength(2)
        })
        .expect(200)
  })

  it("should delete/", async () => {
    await friendShipRepository.create(friendShip2)

    accessKey = sign(
      {
          id: user.props.id,
          schoolId: user.props.schoolId
      },
      "maytheforcebewithyou" 
  );
  
  await supertest(app)
      .delete("/friend")
      .set("access_key", accessKey)
      .send({
        id: friendShip2.props.id
      })
      .expect(200)
  })
});
