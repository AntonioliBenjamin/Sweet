import {Gender} from "./../../Entities/User";
import {SignUp} from "../../usecases/user/SignUp";
import {User} from "../../Entities/User";
import {UserErrors} from "../../errors/UserErrors";
import {School} from "../../Entities/School";
import {SchoolErrors} from "../../errors/SchoolErrors";
import { testContainer } from '../adapters/container/inversify.config'
import { identifiers } from "../../identifiers/identifiers";
import { schoolDb } from "../adapters/container/inversify.config";

const db = new Map<string, User>();

describe("Unit - SignUp", () => {
    let signUp: SignUp;
    let school: School;

    beforeAll(() => {
        signUp = testContainer.get(identifiers.SignUp)

        school = new School({
            id: "6789",
            city: "Paris",
            name: "ENA",
            district: "idf",
        });

        
        schoolDb.set("6789", school);
    });

    afterEach(() => {
        db.clear();
    });

    it("should create user", async () => {
        const result = await signUp.execute({
            userName: "JOJO",
            firstName: "gerard",
            lastName: "bouchard",
            schoolId: "6789",
            section: "2e",
            age: 13,
            gender: Gender.BOY,
            email: "jojo@gmail.com",
            password: "1234",
        });

        expect(result.props.id).toBeTruthy();
        expect(result.props.userName).toEqual("jojo");
    });

    it("should throw because school not found", async () => {
        const result = () =>
            signUp.execute({
                userName: "JOJO",
                firstName: "gerard",
                lastName: "bouchard",
                schoolId: "false id",
                section: "2e",
                age: 13,
                gender: Gender.BOY,
                email: "jojo@gmail.com",
                password: "1234",
            });

        await expect(() => result()).rejects.toThrow(SchoolErrors.NotFound);
    });

    it("should throw if user already exists", async () => {
        await signUp.execute({
            userName: "JOJO",
            firstName: "gerard",
            lastName: "bouchard",
            schoolId: "6789",
            section: "2e",
            age: 13,
            gender: Gender.BOY,
            email: "jojo@gmail.com",
            password: "1234",
        });

        const result = () =>
            signUp.execute({
                userName: "JOJO",
                firstName: "gerard",
                lastName: "bouchard",
                schoolId: "6789",
                section: "2e",
                age: 13,
                gender: Gender.BOY,
                email: "jojo@gmail.com",
                password: "1234",
            });

        await expect(() => result()).rejects.toThrow();
    });

    it("should throw because too young", async () => {
        const result = () =>
            signUp.execute({
                userName: "JOJO",
                firstName: "gerard",
                lastName: "bouchard",
                schoolId: "6789",
                section: "2e",
                age: 11,
                gender: Gender.BOY,
                email: "jojo@gmail.com",
                password: "1234",
            });

        await expect(() => result()).rejects.toThrow(UserErrors.TooYoung);
    });
});
