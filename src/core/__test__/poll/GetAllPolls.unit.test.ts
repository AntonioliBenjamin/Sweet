import {Poll} from "../../Entities/Poll";
import {GetAllPolls} from "../../usecases/poll/GetAllPolls";
import {InMemoryPollRepository} from "../adapters/repositories/InMemoryPollRepository";


const db = new Map<string, Poll>();

describe('Unit - GetAllPolls', () => {
    let getAllPolls: GetAllPolls;
    let poll1: Poll;
    let poll2: Poll;


    beforeAll(() => {
        const inMemoryPollRepository = new InMemoryPollRepository(db);
        getAllPolls = new GetAllPolls(inMemoryPollRepository);

        poll1 = new Poll({
            pollId: "1234",
            questions: [],
            createdAt: new Date()
        })
        poll2 = new Poll({
            pollId: "5678",
            questions: [],
            createdAt: new Date()
        })

        db.set("1234", poll1);
        db.set("5678", poll2);
    })

    it('should get all polls', async () => {
        const result = await getAllPolls.execute();
        expect(result).toHaveLength(2);
    });
});
