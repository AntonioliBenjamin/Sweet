import { FriendShip } from "../../Entities/FriendShip"
import { GetAllFriendShipsByUserId } from "../../usecases/friendShip/GetAllFriendShipsByUserId";
import { InMemoryFriendShipRepository } from "../adapters/repositories/InMemoryFirendShipRepository"
const db = new Map<string, FriendShip>();


describe("Unit - GetAllFriendShipsByUserId", () => {
    it("should get all friendships by user id", async () => {
        const inMemoryFriendShipRepository = new InMemoryFriendShipRepository(db)
        const getAllFriendShipsByUserId = new GetAllFriendShipsByUserId(inMemoryFriendShipRepository)

        const friendship = FriendShip.create({
            id: "156489sdfsdf8486",
            recipientId: "1111",
            senderId: "5555"
        })

        const friendship2 = FriendShip.create({
            id: "6546545sdfsdf6465465",
            recipientId: "7777",
            senderId: "1111"
        })

        const friendship3 = FriendShip.create({
            id: "65489646816543545dfsdf",
            recipientId: "1111",
            senderId: "9999"
        })

        db.set(friendship.props.id, friendship)
        db.set(friendship2.props.id, friendship2)
        db.set(friendship3.props.id, friendship3)

        const result = await getAllFriendShipsByUserId.execute("1111")
        expect(result).toHaveLength(3)
    })
})