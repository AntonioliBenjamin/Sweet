
import { Followed } from "../../Entities/Followed";
import { FollowErrors } from "../../errors/FollowErrors";
import { UnfollowUser } from "../../usecases/follow/UnfollowUser";
import { InMemoryFriendShipRepository } from "../adapters/repositories/InMemoryFollowRepository";

const db = new Map<string, Followed>();

describe("Unit - UnfollowUser", () => {
    let unfollowUser: UnfollowUser

    beforeAll(() => {
    const inMemoryFriendShipRepository = new InMemoryFriendShipRepository(db)
    unfollowUser = new UnfollowUser(inMemoryFriendShipRepository)

    })

    it("should delete followed", async () => {
        const followed = Followed.create({
            id: "0000",
            recipientId: "1111",
            senderId: "2222"
        })
        db.set(followed.props.id, followed)

        const result = await unfollowUser.execute("0000");
        expect(db.get("0000")).toBeFalsy()
    })

    it("should throw if followed not found", async () => {
        const followed = Followed.create({
            id: "0000",
            recipientId: "1111",
            senderId: "2222"
        })
        db.set(followed.props.id, followed)

        const result = () => unfollowUser.execute("false");
        expect(async () => await result()).rejects.toThrow(FollowErrors.NotFound)
    })
})