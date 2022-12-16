import { FriendShip } from "../../Entities/FriendShip";
import { FriendShipErrors } from "../../errors/FriendShipErrors";
import { DeleteFriendShip } from "../../usecases/friendShip/DeleteFriendShip";
import { InMemoryFriendShipRepository } from "../adapters/repositories/InMemoryFirendShipRepository";

const db = new Map<string, FriendShip>();

describe("Unit - DeleteFriendShip", () => {
    let deleteFriendShip: DeleteFriendShip

    beforeAll(() => {
    const inMemoryFriendShipRepository = new InMemoryFriendShipRepository(db)
    deleteFriendShip = new DeleteFriendShip(inMemoryFriendShipRepository)

    })

    it("should delete friendship", async () => {
        const friendship = FriendShip.create({
            id: "0000",
            recipientId: "1111",
            senderId: "2222"
        })
        db.set(friendship.props.id, friendship)

        const result = await deleteFriendShip.execute("0000");
        expect(db.get("0000")).toBeFalsy()
    })

    it("should throw if friendship not found", async () => {
        const friendship = FriendShip.create({
            id: "0000",
            recipientId: "1111",
            senderId: "2222"
        })
        db.set(friendship.props.id, friendship)

        const result = () => deleteFriendShip.execute("false");
        expect(async () => await result()).rejects.toThrow(FriendShipErrors.NotFound)
    })
})