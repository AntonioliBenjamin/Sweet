import { inject, injectable } from "inversify";
import { Gender } from "./../../Entities/User";
import { UseCase } from "../Usecase";
import { User } from "../../Entities/User";
import { UserRepository } from "../../repositories/UserRepository";
import { IdGateway } from "../../gateways/IdGateway";
import { PasswordGateway } from "../../gateways/PasswordGateway";
import { UserErrors } from "../../errors/UserErrors";
import { SchoolRepository } from "../../repositories/SchoolRepository";
import { SchoolErrors } from "../../errors/SchoolErrors";
import { identifiers } from "../../identifiers/identifiers";
import {JsonController} from "routing-controllers";


export type UserInput = {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  schoolId: string;
  section: string;
  gender: Gender;
};

@JsonController()
@injectable()
export class SignUp implements UseCase<UserInput, User> {
  constructor(
    @inject(identifiers.UserRepository) private readonly userRepository: UserRepository,
    @inject(identifiers.SchoolRepository) private readonly schoolRepository: SchoolRepository,
    @inject(identifiers.IdGateway) private readonly idGateway: IdGateway,
    @inject(identifiers.PasswordGateway) private readonly passwordGateway: PasswordGateway
  ) {}

  async execute(input: UserInput): Promise<User> {
    const userExists = await this.userRepository.getByEmail(
      input.email.toLowerCase().trim()
    );
    if (userExists) {
      throw new UserErrors.AlreadyExist();
    }

    const school = this.schoolRepository.getBySchoolId(input.schoolId);
    if (!school) {
      throw new SchoolErrors.NotFound();
    }

    const id = this.idGateway.generate();

    const hash = this.passwordGateway.encrypt(input.password);

    const user = User.create({
      id: id,
      userName: input.userName,
      email: input.email,
      password: hash,
      age: input.age,
      firstName: input.firstName,
      lastName: input.lastName,
      schoolId: school.props.id,
      section: input.section,
      gender: input.gender,
    });

    const result = await this.userRepository.create(user);

    return result;
  }
}
