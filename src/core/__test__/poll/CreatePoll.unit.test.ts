import 'reflect-metadata';
import {Poll} from "../../Entities/Poll";
import {InMemoryPollRepository} from "../adapters/repositories/InMemoryPollRepository";
import {UuidGateway} from "../adapters/gateways/UuidGateway";
import {CreatePoll} from "../../usecases/poll/CreatePoll";
import {Question} from "../../Entities/Question";
import {InMemoryQuestionRepository} from "../adapters/repositories/InMemoryQuestionRepository";

const dbPoll = new Map<string, Poll>();
const dbQuestion = new Map<string, Question>();

describe("Unit - CreatePoll", () => {
    it("should create poll", async () => {
        const inMemoryPollRepository = new InMemoryPollRepository(dbPoll);
        const inMemoryQuestionRepository = new InMemoryQuestionRepository(dbQuestion);
        const uuidGateway = new UuidGateway();
        const createPoll = new CreatePoll(inMemoryPollRepository, inMemoryQuestionRepository, uuidGateway);

        const result = await createPoll.execute();
        expect(result).toBe(void 0);
        expect(dbPoll.size).toEqual(1)
    });
});
