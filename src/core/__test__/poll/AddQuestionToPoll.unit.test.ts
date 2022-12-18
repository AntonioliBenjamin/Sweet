import {Poll} from "../../Entities/Poll";
import {AddQuestionToPoll} from "../../usecases/poll/AddQuestionToPoll";
import {InMemoryPollRepository} from "../adapters/repositories/InMemoryPollRepository";
import {InMemoryQuestionRepository} from "../adapters/repositories/InMemoryQuestionRepository";
import {Question} from "../../Entities/Question";
import {PollErrors} from "../../errors/PollErrors";

const dbPoll = new Map<string, Poll>();
const dbQuestion = new Map<string, Question>();

describe('Unit - AddQuestionToPoll', () => {
    let addQuestionToPoll: AddQuestionToPoll;
    let poll: Poll;
    let question: Question;


    beforeAll(() => {
        const inMemoryPollRepository = new InMemoryPollRepository(dbPoll);
        const inMemoryQuestionRepository = new InMemoryQuestionRepository(dbQuestion);
        addQuestionToPoll = new AddQuestionToPoll(inMemoryPollRepository, inMemoryQuestionRepository)

        question = new Question({
            questionId: "1234",
            description: "yes",
            picture: "http://from"
        })
        dbQuestion.set(question.props.questionId, question);

    })

    it('should add question to poll', async () => {
        poll = new Poll({
            pollId: "1234",
            questions: [],
            createdAt: new Date()
        })
        dbPoll.set(poll.props.pollId, poll);

        const result = await addQuestionToPoll.execute({
            questionId: "1234",
            pollId: "1234"
        })
        expect(result.props.questions).toBeTruthy();
        dbPoll.delete(poll.props.pollId);
    })
    it('should throw if question already added', async () => {
        poll = new Poll({
            pollId: "1234",
            questions: [{
                questionId: "1234",
                description: "yes",
                picture: "http://from"
            }],
            createdAt: new Date()
        })
        dbPoll.set(poll.props.pollId, poll);

        const result = () => addQuestionToPoll.execute({
            questionId: "1234",
            pollId: "1234"
        })
        await expect(() => result()).rejects.toThrow(PollErrors.QuestionAlreadyAdded);
    })


})