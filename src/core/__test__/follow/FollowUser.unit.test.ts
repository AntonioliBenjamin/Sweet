import { Followed } from "../../Entities/Followed";
import { Gender, User } from "../../Entities/User";
import { FollowErrors } from "../../errors/FollowErrors";
import { FollowUser } from "../../usecases/follow/FollowUser";
import { UuidGateway } from "../adapters/gateways/UuidGateway";
import { InMemoryFollowRepository } from "../adapters/repositories/InMemoryFollowRepository";
import { InMemoryUserRepository } from "../adapters/repositories/InMemoryUserRepository";

const db = new Map<string, User>();
const dbFollow = new Map<string, Followed>();

describe("Unit - CreatFriendShip", () => {
    let followUser: FollowUser;
    let sender: User;
    let recipient: User;
    
    beforeAll(() => {
        const inMemoryUserRepository = new InMemoryUserRepository(db)
        const inMemoryFriendShipRepository = new InMemoryFollowRepository(dbFollow)
        const idGateway = new UuidGateway()
        followUser = new FollowUser(inMemoryFriendShipRepository, idGateway)

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
            addedBy: sender.props.id, 
            userId: recipient.props.id
        })
        expect(result.props.userId).toEqual("22222")
        expect(result.props.addedBy).toEqual("11111")
        expect(result.props.id).toBeTruthy()
        dbFollow.clear()
    })

    it("should return followed if followed is already establsihed", async () => {
        const followed = new Followed({
            id: "already exist",
            userId: recipient.props.id,
            addedBy: sender.props.id
        })
        dbFollow.set(followed.props.id, followed)
        
        const result = await followUser.execute({
            addedBy: sender.props.id, 
            userId: recipient.props.id
        })
        expect(result.props.id).toEqual("already exist")
    })
})