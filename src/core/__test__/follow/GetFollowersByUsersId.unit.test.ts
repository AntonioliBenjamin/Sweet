import { Followed } from "../../Entities/Followed";
import { GetFollowersByUsersId } from "../../usecases/follow/GetFollowersByUsersId";
import { InMemoryFollowRepository } from "../adapters/repositories/InMemoryFollowRepository"
const db = new Map<string, Followed>();


describe("Unit - getFollowersByUsersId", () => {
    it("should get all friendships by user id", async () => {
        const inMemoryFriendShipRepository = new InMemoryFollowRepository(db)
        const getFollowersByUsersId = new GetFollowersByUsersId(inMemoryFriendShipRepository)

        const followed = Followed.create({
            id: "156489sdfsdf8486",
            userId: "1111",
            addedBy: "5555"
        })

        const friendship2 = Followed.create({
            id: "6546545sdfsdf6465465",
            userId: "7777",
            addedBy: "1111"
        })

        const friendship3 = Followed.create({
            id: "65489646816543545dfsdf",
            userId: "1111",
            addedBy: "9999"
        })

        db.set(followed.props.id, followed)
        db.set(friendship2.props.id, friendship2)
        db.set(friendship3.props.id, friendship3)

        const result = await getFollowersByUsersId.execute("1111")
        expect(result).toHaveLength(3)
    })
})