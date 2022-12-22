
import { Followed } from "../../Entities/Followed";
import { FollowErrors } from "../../errors/FollowErrors";
import { UnfollowUser } from "../../usecases/follow/UnfollowUser";
import { InMemoryFollowRepository } from "../adapters/repositories/InMemoryFollowRepository";

const db = new Map<string, Followed>();

describe("Unit - UnfollowUser", () => {
    let unfollowUser: UnfollowUser;
    let followed: Followed;

    beforeAll(() => {
    const inMemoryFriendShipRepository = new InMemoryFollowRepository(db)
    unfollowUser = new UnfollowUser(inMemoryFriendShipRepository)

    followed = Followed.create({
        id: "0000",
        userId: "1111",
        addedBy: "2222"
    })

    db.set(followed.props.id, followed)
    })

    it("should delete followed", async () => {
        await unfollowUser.execute("0000");

        expect(db.get("0000")).toBeFalsy()
    })

    it("should throw if followed not found", async () => {
        const followed = Followed.create({
            id: "0000",
            userId: "1111",
            addedBy: "2222"
        })

        db.set(followed.props.id, followed)

        const result = () => unfollowUser.execute("false");
        
        expect(async () => await result()).rejects.toThrow(FollowErrors.NotFound)
    })
})