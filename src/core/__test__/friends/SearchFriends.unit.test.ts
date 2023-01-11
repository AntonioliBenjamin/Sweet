import 'reflect-metadata';
import { Gender, User } from "../../Entities/User";
import { SearchFriends } from "../../usecases/friends/SearchFriends";
import { InMemoryUserRepository } from "../adapters/repositories/InMemoryUserRepository";

const db = new Map<string, User>();
    let searchFriends: SearchFriends

beforeAll(() => {
    const inMemoryUserRepository = new InMemoryUserRepository(db);
    searchFriends = new SearchFriends(inMemoryUserRepository)

    const user = new User({
        email: "user@example.com",
        id: "12345",
        password: "password",
        userName: "michel",
        age: 15,
        firstName: "mich",
        gender: Gender.BOY,
        lastName: "polllich",
        schoolId: "456",
        section: "cp",
        createdAt: new Date(),
        updatedAt: null,
      });

    const user1 = new User({
        email: "user@example.com",
        id: "231651651651",
        password: "password",
        userName: "michael",
        age: 15,
        firstName: "mich",
        gender: Gender.BOY,
        lastName: "polllich",
        schoolId: "456",
        section: "cp",
        createdAt: new Date(),
        updatedAt: null,
      });

    const user2 = new User({
        email: "user@example.com",
        id: "987878",
        password: "password",
        userName: "mini",
        age: 15,
        firstName: "mich",
        gender: Gender.BOY,
        lastName: "polllich",
        schoolId: "0000",
        section: "cp",
        createdAt: new Date(),
        updatedAt: null,
      });

      db.set(user.props.id, user)
      db.set(user1.props.id, user1)
      db.set(user2.props.id, user2)
})

describe("Unit - searchFriends", () => {

    it("should return all users who cotains the keyword in userName", async () => {
        const result = await searchFriends.execute({
            keyword: "mi",
            schoolId: ""
        })
        expect(result).toHaveLength(3)
    })

    it("should return all users who cotains the keyword in userName and have the same school id", async () => {
        const result = await searchFriends.execute({
            keyword: "mi",
            schoolId: "456"
        })
        expect(result).toHaveLength(2)
    })
})
