import {Poll} from "../../Entities/Poll";
import {InMemoryPollRepository} from "../adapters/repositories/InMemoryPollRepository";
import {GetCurrentPoll} from "../../usecases/poll/GetCurrentPoll";
import {PollErrors} from "../../errors/PollErrors";

const db = new Map<string, Poll>();

describe("Unit - GetCurrentPoll", () => {
    let inMemoryPollRepository : InMemoryPollRepository;
    let getCurrentPoll : GetCurrentPoll;
    let poll1 : Poll;
    let poll2 : Poll;

    beforeAll(() => {
        inMemoryPollRepository = new InMemoryPollRepository(db);
        getCurrentPoll = new GetCurrentPoll(inMemoryPollRepository);

        poll1 = new Poll({
            pollId: "1234",
            questions: [],
            createdAt: new Date(1),
            expirationDate : new Date(new Date(1).setHours(new Date(1).getHours()+1)),
        });

        poll2 = new Poll({
            pollId: "5678",
            questions: [],
            createdAt: new Date(),
            expirationDate : new Date(new Date().setHours(new Date().getHours()+1)),
        });
    })

    afterEach(() => {
        db.clear();
    })



    it("should throw because date expired", async () => {
        db.set("1234", poll1);
        const result = ()=> getCurrentPoll.execute();

        await expect(()=>result()).rejects.toThrow( PollErrors.DateExpired);
    });

    it("should get current poll", async () => {
        db.set("1234", poll1);
        db.set("5678", poll2);
        const result = await getCurrentPoll.execute();

        expect(result.props.pollId).toEqual("5678");
    });
});