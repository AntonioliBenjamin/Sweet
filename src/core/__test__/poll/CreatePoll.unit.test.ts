import {Poll} from "../../Entities/Poll";
import {InMemoryPollRepository} from "../adapters/repositories/InMemoryPollRepository";
import {UuidGateway} from "../adapters/gateways/UuidGateway";
import {CreatePoll} from "../../usecases/poll/CreatePoll";


const db = new Map<string, Poll>();


describe("Unit - CreatePoll", () => {
    let createPoll: CreatePoll;

    beforeAll(() => {
        const inMemoryPollRepository = new InMemoryPollRepository(db);
        const uuidGateway = new UuidGateway();
        createPoll = new CreatePoll(inMemoryPollRepository, uuidGateway);
    });

    it("should create poll", async () => {
        const result = await createPoll.execute();
        expect(result).toBe(void 0);
    });
});