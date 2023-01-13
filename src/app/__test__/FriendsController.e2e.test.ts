import 'reflect-metadata';
import supertest from "supertest";
import "dotenv/config";
import {sign} from "jsonwebtoken";
import {Gender, User} from "../../core/Entities/User";
import {UserRepository} from "../../core/repositories/UserRepository";
import {connectDB, dropCollections, dropDB} from "../../adapters/__test__/setupTestDb";
import { createExpressServer, useContainer, useExpressServer } from "routing-controllers";
import { FriendsController } from "../controllers/FriendsController";
import { PovKernel } from '../config/PovKernel';
import { identifiers } from '../../core/identifiers/identifiers';

const app = createExpressServer({
    defaults: {
      nullResultCode: 404,
      undefinedResultCode: 204,
      paramOptions: {
        required: false,
      },
    },
  });

describe("E2E - FriendsController", () => {
    let accessKey;
    let mongoDbUserRepository: UserRepository;
    let user: User;
    let user2: User;
    let user3: User;

    beforeAll(async () => {
        await connectDB();

        useExpressServer(app, {
            controllers: [FriendsController]
        })

        const container = new PovKernel();
        
        container.init();
        
        useContainer(container);

        user = new User({
            email: "user1@example.com",
            id: "12345",
            password: "password1",
            userName: "mickey",
            age: 15,
            firstName: "mickey",
            gender: Gender.BOY,
            lastName: "polllich",
            schoolId: "456",
            section: "cp",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        user2 = User.create({
            email: "2@example.com",
            id: "9999",
            password: "password2",
            userName: "mickael",
            age: 15,
            firstName: "mickael",
            gender: Gender.BOY,
            lastName: "polllich",
            schoolId: "456",
            section: "cp",
        });

        user3 = User.create({
            email: "user3@example.com",
            id: "sdfsdf",
            password: "password3",
            userName: "mini",
            age: 15,
            firstName: "mich",
            gender: Gender.BOY,
            lastName: "polllich",
            schoolId: "0000",
            section: "cp",
        });

        mongoDbUserRepository = container.get(identifiers.UserRepository)
    });

    beforeEach(async () => {
        await mongoDbUserRepository.create(user);
        await mongoDbUserRepository.create(user2);
        await mongoDbUserRepository.create(user3);
    });

    afterEach(async () => {
        await dropCollections();
    });

    afterAll(async () => {
        await dropDB();
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
                const responseBody = response.body;
                expect(responseBody).toHaveLength(3)
            })
    })
})   
