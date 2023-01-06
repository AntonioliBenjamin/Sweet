import { Poll } from "../../Entities/Poll";
import { GetAllPolls } from "../../usecases/poll/GetAllPolls";
import { InMemoryPollRepository } from "../adapters/repositories/InMemoryPollRepository";

const db = new Map<string, Poll>();

describe("Unit - GetAllPolls", () => {
  it("should get all polls", async () => {
    const inMemoryPollRepository = new InMemoryPollRepository(db);
    const getAllPolls = new GetAllPolls(inMemoryPollRepository);

    const poll1 = new Poll({
      pollId: "1234",
      questions: [],
      createdAt: new Date(),
      expirationDate : new Date(new Date().setHours(new Date().getHours()+1)),
    });

    const poll2 = new Poll({
      pollId: "5678",
      questions: [],
      createdAt: new Date(),
      expirationDate : new Date(new Date().setHours(new Date().getHours()+1)),
    });

    db.set("1234", poll1);
    db.set("5678", poll2);

    const result = await getAllPolls.execute();

    expect(result).toHaveLength(2);
  });
});
