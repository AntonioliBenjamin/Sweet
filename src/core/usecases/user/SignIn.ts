import {UseCase} from "../Usecase";
import {User} from "../../Entities/User";
import {UserRepository} from "../../repositories/UserRepository";
import {PasswordGateway} from "../../gateways/PasswordGateway";

export type UserInput = {
    email: string,
    password: string,
}

export class SignIn implements UseCase<UserInput, User> {

    constructor(private readonly userRepository: UserRepository,
                private readonly passwordGateway: PasswordGateway) {
    }

    async execute(input: UserInput): Promise<User> {
        const userExists =await this.userRepository.getByEmail(input.email.toLowerCase().trim());
        if (!userExists) {
            throw new Error('user not found')
        }
        const hash = userExists.props.password

        const comparePasswords = this.passwordGateway.decrypt(input.password, hash)
        if (!comparePasswords) {
            throw new Error('wrong password')
        }
        console.log('User connected successfully');
        return userExists;
    }
}