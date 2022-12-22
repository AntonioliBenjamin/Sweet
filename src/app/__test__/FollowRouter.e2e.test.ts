import "dotenv/config";
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
import { UserModel } from "../../adapters/repositories/mongoDb/models/user";
import { FollowModel } from "../../adapters/repositories/mongoDb/models/follow";
import { Followed } from "../../core/Entities/Followed";

const app = express();

describe("E2E - FollowRouter", () => {
  let accessKey;
  let userRepository: UserRepository;
  let followRepository: FollowedRepository;
  let user: User;
  let user2: User;
  let user3: User;
  let follow: Followed;
  let follow2: Followed;
  let follow3: Followed;

  beforeAll(async () => {
    userRepository = new MongoDbUserRepository();
    followRepository = new MongoDbFollowRepository();

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

    user = new User({
      email: "user@example.com",
      id: "chalom",
      password: "password",
      userName: "user Name",
      age: 15,
      firstName: "michou",
      gender: Gender.BOY,
      lastName: "papito",
      schoolId: "456",
      section: "cp",
      createdAt: new Date(),
      updatedAt: null,
      recoveryCode: null,
    });

    user2 = new User({
      email: "pollicr@example.com",
      id: "cedric",
      password: "jkhfsdkjhfkjs",
      userName: "cedric",
      age: 15,
      firstName: "denis",
      gender: Gender.BOY,
      lastName: "polllich",
      schoolId: "456",
      section: "cp",
      createdAt: new Date(),
      updatedAt: null,
      recoveryCode: null,
    });

    user3 = new User({
      email: "email@example.com",
      id: "mazen",
      password: "jkhfsdkjhfkjs",
      userName: "mazen",
      age: 15,
      firstName: "denis",
      gender: Gender.BOY,
      lastName: "polllich",
      schoolId: "456",
      section: "cp",
      createdAt: new Date(),
      updatedAt: null,
      recoveryCode: null,
    });

    follow = new Followed({
      id: "1111",
      userId: "cedric",
      addedBy: "mazen",
    });

    follow2 = new Followed({
      id: "2222",
      userId: "cedric",
      addedBy: "chalom",
    });

    follow3 = new Followed({
      id: "3333",
      userId: "chalom",
      addedBy: "cedric",
    });
  });

  beforeEach(async () => {
    await userRepository.create(user);
    await userRepository.create(user2);
    await userRepository.create(user3);
  });

  afterEach(async () => {
    await UserModel.collection.drop();
    await FollowModel.collection.drop();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should post/follow", async () => {
    accessKey = sign(
      {
        id: user.props.id,
        schoolId: user.props.schoolId,
      },
      "maytheforcebewithyou"
    );

    await supertest(app)
      .post("/follow")
      .set("access_key", accessKey)
      .send({
        userIdArray: ["cedric", "mazen"],
        addedBy: "chalom",
      })

      .expect((response) => {
        const responseBody = response.body;
        expect(responseBody).toHaveLength(2);
      })
      .expect(201);
  });

  it("should get/follow/mine", async () => {
    await followRepository.create(follow);
    await followRepository.create(follow2);
    await followRepository.create(follow3);

    accessKey = sign(
      {
        id: user2.props.id,
        schoolId: user2.props.schoolId,
      },
      "maytheforcebewithyou"
    );

    await supertest(app)
      .get(`/follow/mine`)
      .set("access_key", accessKey)

      .expect((response) => {
        const responseBody = response.body;
        expect(responseBody).toHaveLength(1);
      })
      .expect(200);
  });

  it("should get/follow/theirs", async () => {
    await followRepository.create(follow);
    await followRepository.create(follow2);
    await followRepository.create(follow3);

    accessKey = sign(
      {
        id: user2.props.id,
        schoolId: user2.props.schoolId,
      },
      "maytheforcebewithyou"
    );

    await supertest(app)
      .get(`/follow/theirs`)
      .set("access_key", accessKey)

      .expect((response) => {
        const responseBody = response.body;
        expect(responseBody).toHaveLength(2);
      })
      .expect(200);
  });

  it("should delete/", async () => {
    await followRepository.create(follow2);

    accessKey = sign(
      {
        id: user.props.id,
        schoolId: user.props.schoolId,
      },
      "maytheforcebewithyou"
    );

    await supertest(app)
      .delete("/follow")
      .set("access_key", accessKey)
      .send({
        id: follow2.props.id,
      })
      .expect(200);
  });
});
