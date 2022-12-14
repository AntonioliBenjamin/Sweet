import {UseCase} from "../Usecase";
import {UserRepository} from "../../repositories/UserRepository";

export type UserDeletedInput = {
    userId: string
}

export class DeleteUser implements UseCase<UserDeletedInput, void> {

    constructor(private readonly userRepository: UserRepository) {
    }

   async execute(input:UserDeletedInput): Promise<void> {
        await this.userRepository.delete(input.userId);
        return ;
    }
}