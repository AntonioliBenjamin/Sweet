import 'reflect-metadata';
import "dotenv/config";
import supertest from 'supertest';
import {QuestionRepository} from "../../core/repositories/QuestionRepository";
import {sign} from "jsonwebtoken";
import {PollRepository} from "../../core/repositories/PollRepository";
import {Poll} from "../../core/Entities/Poll";
import {connectDB, dropCollections, dropDB} from "../../adapters/__test__/setupTestDb";
import { createExpressServer, useContainer, useExpressServer } from "routing-controllers";
import { PollController } from '../controllers/Pollcontroller'
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

describe("E2E - Poll Controller", () => {
    let accessKey;
    let questionRepository: QuestionRepository;
    let pollRepository: PollRepository;
    let poll: Poll;
    let poll2: Poll

    beforeAll(async () => {
        await connectDB();

        useExpressServer(app, {
            controllers: [PollController]
        })

        const container = new PovKernel();
        
        container.init();
        
        useContainer(container);

        questionRepository = container.get(identifiers.QuestionRepository)
        pollRepository = container.get(identifiers.PollRepository)

        poll = Poll.create({
            pollId: "5678"
        })

        poll2 = new Poll({
            pollId: "0000",
            createdAt: new Date(1),
            expirationDate: new Date(new Date(1).setHours(new Date(1).getHours() + 1)),
        })
    });

    afterEach(async () => {
        await dropCollections();
    });

    afterAll(async () => {
        await dropDB();
    });

    it("Should get/poll/all", async () => {
        await pollRepository.create(poll);

        accessKey = sign(
            {
                id: "1234",
                schoolId: "5678",
                email: "blabla@gmail.com"
            },
            "maytheforcebewithyou"
        );

        await supertest(app)
            .get("/poll/all")
            .set("access_key", accessKey)
            .expect((response) => {
                const responseBody = response.body;
                expect(responseBody).toHaveLength(1);
            })
            .expect(200);
    });

    it("Should get/poll/", async () => {
        await pollRepository.create(poll);
        await pollRepository.create(poll2);

        accessKey = sign(
            {
                id: "1234",
                schoolId: "5678",
                email: "blabla@gmail.com"
            },
            "maytheforcebewithyou"
        );

        await supertest(app)
            .get("/poll")
            .set("access_key", accessKey)
            .expect((response) => {
                const responseBody = response.body;
                expect(responseBody).toBeTruthy();
            })
            .expect(200);
    });
});

