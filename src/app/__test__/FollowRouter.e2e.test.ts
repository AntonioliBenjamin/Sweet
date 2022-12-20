import "dotenv/config";
import { followRouter } from "../routes/follow";
import { followRouter } from "../routes/follow";
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
import { MongoDbFollowRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbFollowRepository";
import { UserModel } from "../../adapters/repositories/mongoDb/models/user";
import { FollowModel } from "../../adapters/repositories/mongoDb/models/follow";
import { Followed } from "../../core/Entities/Followed";
import {FollowModel} from "../../adapters/repositories/mongoDb/models/follow";

const app = express();

describe("E2E - FriendShipRouter", () => {
  let accessKey;
  let userRepository: UserRepository;
  let friendShipRepository: FollowedRepository;
  let user: User;
  let user2: User;
  let follow: Followed;
  let friendShip2: Followed

  beforeAll(() => {
    userRepository = new MongoDbUserRepository();
    friendShipRepository = new MongoDbFollowRepository();

    app.use(express.json());
    app.use("/follow", followRouter);

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

    follow = Followed.create({
      id: "1111",
      userId: user2.props.id,
      addedBy: user.props.id, 
    })

    friendShip2 = Followed.create({
      id: "2222",
      userId: user2.props.id,
      addedBy: "0000", 
    })
  });

  beforeEach(async() => {
    await userRepository.create(user);
    await userRepository.create(user2);
  })

  afterEach(async () => {
    await UserModel.collection.drop();
    await FollowModel.collection.drop();
    await FollowModel.collection.drop();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should post/follow/add", async () => {
    accessKey = sign(
        {
            id: user.props.id,
            schoolId: user.props.schoolId
        },
        "maytheforcebewithyou" 
    );
    
    await supertest(app)
        .post("/follow/add")
        .set("access_key", accessKey)
        .send({
          userId: user2.props.id,
            addedBy: user.props.id, 
        })

        .expect((response) => {
            const responseBody = response.body;
            expect(responseBody.addedBy).toEqual("8888")
        })
        .expect(201)
  })

  it("should get/follow/all/:userId", async () => {
      await friendShipRepository.create(follow)
      await friendShipRepository.create(friendShip2)

      accessKey = sign(
        {
            id: user.props.id,
            schoolId: user.props.schoolId
        },
        "maytheforcebewithyou" 
    );
    
    await supertest(app)
        .get(`/follow/all/${user2.props.id}`)
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
      .delete("/follow")
      .set("access_key", accessKey)
      .send({
        id: friendShip2.props.id
      })
      .expect(200)
  })
});
