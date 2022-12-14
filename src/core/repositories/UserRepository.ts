import {User} from "../Entities/User";

export interface UserRepository {
    create(input: User): Promise<User>;

    getByEmail(email: string): Promise<User>;

    getById(userId: string): Promise<User>;

    update (input: User) : Promise<User>;

    delete(userId:string): Promise<void>;
}