import {Poll} from "../../Entities/Poll";
import {Question} from "../../Entities/Question";
import {InMemoryPollRepository} from "../adapters/repositories/InMemoryPollRepository";
import {InMemoryQuestionRepository} from "../adapters/repositories/InMemoryQuestionRepository";
import {UuidGateway} from "../adapters/gateways/UuidGateway";
import {DeletePoll} from "../../usecases/poll/DeletePoll";


const dbPoll = new Map<string, Poll>();
const dbQuestion = new Map<string, Question>();

describe("Unit - DeletePoll", () => {
    it("should delete poll by Id", async () => {
        const inMemoryPollRepository = new InMemoryPollRepository(dbPoll);
        const inMemoryQuestionRepository = new InMemoryQuestionRepository(dbQuestion);
        const uuidGateway = new UuidGateway();
        const deletePoll = new DeletePoll(inMemoryPollRepository);

        const poll = new Poll({
            pollId: "1234",
            expirationDate: new Date,
            createdAt: new Date,
        })
        dbPoll.set(poll.props.pollId, poll)

        const result = await deletePoll.execute({pollId: poll.props.pollId});
        expect(result).toBe(void 0);
        expect(dbPoll.size).toEqual(0)
    });
});
