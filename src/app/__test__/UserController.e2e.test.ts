import "reflect-metadata";
const supertest = require('supertest');
import "dotenv/config";
import {sign} from "jsonwebtoken";
import {MongoDbUserRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";
import {Gender, User} from "../../core/Entities/User";
import {UserRepository} from "../../core/repositories/UserRepository";
import {BcryptGateway} from "../../adapters/gateways/BcryptGateway";
import {connectDB, dropCollections, dropDB} from "../../adapters/__test__/setupTestDb";
import {createExpressServer, useExpressServer} from "routing-controllers";
import {UserController} from "../controllers/UserController";

const app = createExpressServer({
    defaults: {
        nullResultCode: 404,
        undefinedResultCode: 204,
        paramOptions: {
            required: false,
        },
    },
});

describe("E2E - User Controller", () => {
    let accessKey;
    let userRepository: UserRepository;
    let user: User;

    beforeAll(async () => {
        useExpressServer(app, {
            controllers: [UserController],
        });

        await connectDB();

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
            recoveryCode: null,
            pushToken: null
        });
    });

    afterEach(async () => {
        await dropCollections();
    });

    afterAll(async () => {
        await dropDB();
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
                gender: "girl",
                firstName: "gdfgdfg",
                lastName: "dfgdrfg",
                section: "dfgdfg",
                id: user.props.id,
                schoolId: "3f5f3ce518a5fd5873ce5b543f560e9bf759a5db"
            })
            .expect((response) => {
                const responseBody = response.body;
                expect(responseBody.gender).toEqual("girl");
                expect(responseBody.schoolId).toEqual("3f5f3ce518a5fd5873ce5b543f560e9bf759a5db");
                expect(responseBody.updatedAt).toBeTruthy();
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

    it("Should get /all/:schoolId", async () => {
        const currentUser = new User({
            userName: "jojolapin",
            email: "jojolapin1@gmail.com",
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

    it("Should patch/user/push-token", async () => {
        await userRepository.create(user);

        accessKey = sign(
            {
                id: user.props.id,
                schoolId: user.props.schoolId,
            },
            "maytheforcebewithyou"
        );

        await supertest(app)
            .patch("/user/push-token")
            .set("access_key", accessKey)
            .send({
                id: user.props.id,
                pushToken: "3f5f3ce518a5fd5873ce5b543f560e9bf759a5db"
            })
            .expect((response) => {
                const responseBody = response.body;
                expect(responseBody.pushToken).toEqual("3f5f3ce518a5fd5873ce5b543f560e9bf759a5db");
            })
            .expect(200);
    });

    it("Should get /:userId", async () => {
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
            .get("/user/12345")
            .set("access_key", accessKey)
            .expect((response) => {
                const responseBody = response.body;
                expect(responseBody.userName).toEqual("jojolapin");
            })
            .expect(200);
    });

});
