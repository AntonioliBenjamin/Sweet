import {User} from "../../../Entities/User";
import {UserRepository} from "../../../repositories/UserRepository";

export class InMemoryUserRepository implements UserRepository {

    constructor(private readonly db: Map<string, User>) {
    }

    create(user: User): Promise<User> {
        this.db.set(user.props.id, user);
        return Promise.resolve(user)
    }

    getByEmail(email: string): Promise<User> {
        const values = Array.from(this.db.values());
        const user = values.find(v => v.props.email === email);
        return Promise.resolve(user);
    }

    getById(id: string): Promise<User> {
        const user = this.db.get(id);
        return Promise.resolve(user);
    }

    update(user: User): Promise<User> {
        this.db.set(user.props.id, user);
        return Promise.resolve(user);
    }

    delete(userId: string): Promise<void> {
        this.db.delete(userId)
        return
    };
}

