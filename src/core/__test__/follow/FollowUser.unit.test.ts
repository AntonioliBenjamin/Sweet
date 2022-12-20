import { Followed } from "../../Entities/Followed";
import { Gender, User } from "../../Entities/User";
import { FollowErrors } from "../../errors/FollowErrors";
import { FollowUser } from "../../usecases/follow/FollowUser";
import { UuidGateway } from "../adapters/gateways/UuidGateway";
import { InMemoryFriendShipRepository } from "../adapters/repositories/InMemoryFollowRepository";
import { InMemoryUserRepository } from "../adapters/repositories/InMemoryUserRepository";

const db = new Map<string, User>();
const dbFriends = new Map<string, Followed>();

describe("Unit - CreatFriendShip", () => {
    let followUser: FollowUser;
    let sender: User;
    let recipient: User;
    
    beforeAll(() => {
        const inMemoryUserRepository = new InMemoryUserRepository(db)
        const inMemoryFriendShipRepository = new InMemoryFriendShipRepository(dbFriends)
        const idGateway = new UuidGateway()
        followUser = new FollowUser(inMemoryUserRepository, inMemoryFriendShipRepository, idGateway)

        sender = User.create({
            age: 15,
            email: "donald@yopmail.com",
            firstName: "donald",
            gender: Gender.BOY,
            id: "11111",
            lastName: "mockey",
            password: "password",
            schoolId: "12345",
            section: "terminal",
            userName: "momo"
        })

        recipient = User.create({
            age: 15,
            email: "elsa@yopmail.com",
            firstName: "elsa",
            gender: Gender.GIRL,
            id: "22222",
            lastName: "neige",
            password: "password",
            schoolId: "12345",
            section: "terminal",
            userName: "reine des neiges"
        })

        db.set(sender.props.id, sender);
        db.set(recipient.props.id, recipient);
    })    

    it("should create a followed", async () => {
        const result = await followUser.execute({
            senderId: sender.props.id, 
            recipientId: recipient.props.id
        })
        expect(result.props.recipientId).toEqual("22222")
        expect(result.props.senderId).toEqual("11111")
        expect(result.props.id).toBeTruthy()
    })

    it("should return followed if followed is already establsihed", async () => {
        const followed = Followed.create({
            id: "already exist",
            recipientId: recipient.props.id,
            senderId: sender.props.id
        })
        dbFriends.set(followed.props.id, followed)

        const result = followUser.execute({
            senderId: sender.props.id, 
            recipientId: recipient.props.id
        })
        await expect(result).rejects.toThrow(new FollowErrors.AlreadyExist) 
    })
})