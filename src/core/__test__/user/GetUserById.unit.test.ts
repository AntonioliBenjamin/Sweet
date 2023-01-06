import {Gender} from "./../../Entities/User";
import {User} from "../../Entities/User";
import {SignUp} from "../../usecases/user/SignUp";
import {InMemoryUserRepository} from "../adapters/repositories/InMemoryUserRepository";
import {UuidGateway} from "../adapters/gateways/UuidGateway";
import {BcryptGateway} from "../adapters/gateways/BcryptGateway";
import {UpdateUser} from "../../Usecases/user/UpdateUser";
import {School} from "../../Entities/School";
import {InMemorySchoolRepository} from "../adapters/repositories/InMemorySchoolRepository";
import {SchoolErrors} from "../../errors/SchoolErrors";
import {GetUserById} from "../../usecases/user/GetUserById";

const db = new Map<string, User>();
const dbSchool = new Map<string, School>();

describe("Unit - GetUserById", () => {
    let inMemoryUserRepository: InMemoryUserRepository;
    let inMemorySchoolRepository: InMemorySchoolRepository;
    let uuidGateway: UuidGateway;
    let bcryptGateway: BcryptGateway;
    let getUserById: GetUserById;
    let user: User;
    let result: User;


    beforeAll(async () => {
        inMemoryUserRepository = new InMemoryUserRepository(db);
        inMemorySchoolRepository = new InMemorySchoolRepository(dbSchool);
        uuidGateway = new UuidGateway();
        bcryptGateway = new BcryptGateway();
        getUserById = new GetUserById(inMemoryUserRepository);
        const signUp = new SignUp(
            inMemoryUserRepository,
            inMemorySchoolRepository,
            uuidGateway,
            bcryptGateway
        );

        const school = new School({
            id: "6789",
            city: "Paris",
            name: "ENA",
            district: "idf",
        });

        const school2 = new School({
            id: "1111",
            city: "Paris",
            name: "ENA",
            district: "idf",
        });

        dbSchool.set("6789", school);
        dbSchool.set("1111", school2);

        user = await signUp.execute({
            userName: "JOJO",
            email: "jojo@gmail.com",
            password: "1234",
            age: 13,
            firstName: "gdfgdfg",
            gender: Gender.BOY,
            lastName: "dfgdrfg",
            schoolId: "6789",
            section: "dfgdfg",
        });

        result = await getUserById.execute({
            userId : user.props.id
        });

    })

    it("should get user by Id", async () => {
        expect(result.props.userName).toEqual("jojo");
        expect(result.props.email).toEqual("jojo@gmail.com");
        expect(result.props.gender).toEqual("boy");
        expect(result.props.schoolId).toEqual("6789");
        expect(bcryptGateway.decrypt("1234", result.props.password)).toEqual(true);
        expect(result.props.id).toEqual(user.props.id);
    });
});
