import supertest from "supertest";
import mongoose from "mongoose";
import "dotenv/config";
import {sign} from "jsonwebtoken";
import express from "express";
import {v4} from "uuid";
import {userRouter} from "../routes/user";
import {MongoDbUserRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";
import {Gender, User} from "../../core/Entities/User";
import {UserModel} from "../../adapters/repositories/mongoDb/models/user";
import {UserRepository} from "../../core/repositories/UserRepository";
import {BcryptGateway} from "../../adapters/gateways/BcryptGateway";

const app = express();

describe("E2E - User Router", () => {
    let accessKey;
    let userRepository: UserRepository;
    let user: User;

    beforeAll(async () => {
        app.use(express.json());
        app.use("/user", userRouter);

        const databaseId = v4();
        mongoose.set("strictQuery", false);
        mongoose.connect(`mongodb://127.0.0.1:27017/${databaseId}`, (err) => {
            if (err) {
                throw err;
            }
            console.info("Connected to mongodb");
        });
        const bcryptGateway = new BcryptGateway();
        userRepository = new MongoDbUserRepository();

        user = new User({
            userName: "jojolapin",
            email: "jojolapin@gmail.com",
            password: bcryptGateway.encrypt("1234"),
            id: "12345",
            age: 15,
            firstName: "mich",
            gender: Gender.BOY,
            lastName: "popo",
            schoolId: "5678",
            section: "dfsdfs",
            createdAt: new Date(),
            updatedAt: null,
            recoveryCode: null
        });
    });

    afterEach(async () => {
        await UserModel.collection.drop();
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it("Should post/user", async () => {
        await supertest(app)
            .post("/user")
            .send({
                userName: "michel",
                email: "mich@michel.fr",
                password: "12345",
                age: 15,
                firstName: "varuk",
                lastName: "michel",
                schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
                section: "cm2",
                gender: "boy",
            })

            .expect((response) => {
                const responseBody = response.body;
                expect(responseBody.userName).toEqual("michel");
            })
            .expect(201);
    });

    it("Should post/user/sign-in", async () => {
        await userRepository.create(user);

        await supertest(app)
            .post("/user/sign-in")
            .send({
                email: "jojolapin@gmail.com",
                password: "1234",
            })
            .expect((response) => {
                const responseBody = response.body;
                expect(responseBody.email).toEqual("jojolapin@gmail.com");
            })
            .expect(200);
    });

    it("Should patch/user", async () => {
        await userRepository.create(user);

        accessKey = sign(
            {
                id: user.props.id,
                schoolId: user.props.schoolId,
            },
            "maytheforcebewithyou"
        );

        await supertest(app)
            .patch("/user")
            .set("access_key", accessKey)
            .send({
                userName: "JOJO",
                gender : "girl",
                firstName: "gdfgdfg",
                lastName: "dfgdrfg",
                section: "dfgdfg",
                id: user.props.id,
                schoolId: "3f5f3ce518a5fd5873ce5b543f560e9bf759a5db"
            })
            .expect((response) => {
                const responseBody = response.body;
                expect(responseBody.updatedAt).toBeTruthy();
                expect(responseBody.gender).toEqual("girl");
                expect(responseBody.schoolId).toEqual("3f5f3ce518a5fd5873ce5b543f560e9bf759a5db");
            })
            .expect(200);
    });

    it("Should delete/user", async () => {
        await userRepository.create(user);

        accessKey = sign(
            {
                id: user.props.id,
                userName: user.props.userName,
                email: user.props.email,
            },
            "maytheforcebewithyou"
        );

        await supertest(app)
            .delete("/user")
            .set("access_key", accessKey)
            .send({
                id: user.props.id,
            })
            .expect((response) => {
                const responseBody = response.body;
                expect(responseBody.userName).toBeFalsy();
            })
            .expect(200);
    });

    it("Should get/all/:schoolId", async () => {
        const currentUser = new User({
            userName: "jojolapin",
            email: "jojolapin@gmail.com",
            password: "1234",
            id: "current user id",
            age: 15,
            firstName: "mich",
            gender: Gender.BOY,
            lastName: "popo",
            schoolId: "5678",
            section: "dfsdfs",
            createdAt: new Date(),
            updatedAt: null,
            recoveryCode: null
        });
        await userRepository.create(currentUser);
        await userRepository.create(user);

        accessKey = sign(
            {
                id: "current user id",
                schoolId: currentUser.props.schoolId,
                email: currentUser.props.email,
            },
            "maytheforcebewithyou"
        );

    await supertest(app)
      .get(`/user/all/5678`)
      .set("access_key", accessKey)
      .expect((response) => {
        const responseBody = response.body;
        expect(responseBody).toHaveLength(1);
      })
      .expect(200);
  });

  it("should post/user/exist", async () => {
    await userRepository.create(user);
    await supertest(app)
      .post("/user/exist")
      .send({
        email: "jojolapin@gmail.com"
      })

      .expect((response) => {
        const responseBody = response.body;
        expect(responseBody.exists).toBeTruthy()
      })
      .expect(200);
  })
});
