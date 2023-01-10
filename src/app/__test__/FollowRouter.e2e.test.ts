import 'reflect-metadata';
import "dotenv/config";
import { createExpressServer, useExpressServer } from "routing-controllers";
import supertest from "supertest";
import { sign } from "jsonwebtoken";
import { MongoDbUserRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";
import { Gender, User } from "../../core/Entities/User";
import { UserRepository } from "../../core/repositories/UserRepository";
import { FollowedRepository } from "../../core/repositories/FollowedRepository";
import { MongoDbFollowRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbFollowRepository";
import { Followed } from "../../core/Entities/Followed";
import {connectDB, dropCollections, dropDB} from "../../adapters/__test__/setupTestDb";
import { FollowController } from "../controllers/FollowController";

const app = createExpressServer({
  defaults: {
    nullResultCode: 404,
    undefinedResultCode: 204,
    paramOptions: {
      required: false,
    },
  },
});

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

    useExpressServer(app, {
      controllers: [FollowController]
  })

    await connectDB();

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
      updatedAt: null

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
      updatedAt: new Date()
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
      updatedAt: new Date()
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
    await dropCollections();
  });

  afterAll(async () => {
    await dropDB();
  });

  it("should post /follow", async () => {
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
        userId: "cedric",
      })

      .expect((response) => {
      
        const responseBody = response.body;
        expect(responseBody.addedBy).toEqual("chalom");
      })
      .expect(201);
  });

  it("should get follow/", async () => {
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
      .get("/follow")
      .set("access_key", accessKey)

      .expect((response) => {
        const responseBody = response.body;
        expect(responseBody).toHaveLength(1);
      })
      .expect(200);
  });

  it("should delete /:userId", async () => {
    await followRepository.create(follow2);

    accessKey = sign(
      {
        id: user.props.id,
        schoolId: user.props.schoolId,
      },
      "maytheforcebewithyou"
    );
    
    await supertest(app)
      .delete(`/follow/${follow2.props.userId}`)
      .set("access_key", accessKey)
      .expect(200);
  });
});
