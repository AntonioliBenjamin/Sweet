import supertest from "supertest";
import mongoose from "mongoose";
import "dotenv/config";
import {v4} from "uuid";
import {sign} from "jsonwebtoken";
import express from "express";
import {friendsRouter} from "../routes/friends";
import {UserModel} from "../../adapters/repositories/mongoDb/models/user";
import {Gender, User} from "../../core/Entities/User";
import {UserRepository} from "../../core/repositories/UserRepository";
import {MongoDbUserRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";

const app = express();

describe("E2E - User Router", () => {
    let accessKey;
    let mongoDbUserRepository: UserRepository;
    let user: User;
    let user2: User;
    let user3: User;

    beforeAll(async () => {
        app.use(express.json());
        app.use("/friends", friendsRouter);

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
            id: "12345",
            password: "password",
            userName: "mickey",
            age: 15,
            firstName: "mickey",
            gender: Gender.BOY,
            lastName: "polllich",
            schoolId: "456",
            section: "cp",
            createdAt: new Date(),
            updatedAt: null,
        });

        user2 = User.create({
            email: "user@example.com",
            id: "9999",
            password: "password",
            userName: "mickael",
            age: 15,
            firstName: "mickael",
            gender: Gender.BOY,
            lastName: "polllich",
            schoolId: "456",
            section: "cp",
        });

        user3 = User.create({
            email: "user@example.com",
            id: "sdfsdf",
            password: "password",
            userName: "mini",
            age: 15,
            firstName: "mich",
            gender: Gender.BOY,
            lastName: "polllich",
            schoolId: "0000",
            section: "cp",
        });

        mongoDbUserRepository = new MongoDbUserRepository();
    });

    beforeEach(async () => {
        await mongoDbUserRepository.create(user);
        await mongoDbUserRepository.create(user2);
        await mongoDbUserRepository.create(user3);
    });

    afterEach(async () => {
        await UserModel.collection.drop();
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it("should get search/:keyword/:schoolId", async () => {

        accessKey = sign(
            {
                id: user.props.id,
                schoolId: user.props.schoolId,
            },
            "maytheforcebewithyou"
        );

        await supertest(app)
            .get("/friends/search/mi/456")
            .set("access_key", accessKey)
            .expect((response) => {
                console.log(response)
                const responseBody = response.body;
                expect(responseBody).toHaveLength(2)
            })
    })
})   
