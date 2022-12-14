import { UserRepository } from './../../repositories/UserRepository';
import { User } from './../../Entities/User';
import { UseCase } from './../Usecase';

export class GetAllUsersBySchool implements UseCase<string, User[]> {
    constructor(
        private readonly userRepository: UserRepository
    ) {}

    async execute(schoolId: string): Promise<User[]> {
        const users = await this.userRepository.getAllUsersBySchool(schoolId)
        return users
    }
}