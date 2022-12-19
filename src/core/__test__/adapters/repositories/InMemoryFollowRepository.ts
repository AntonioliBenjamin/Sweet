import { Followed } from "../../../Entities/Followed";
import { FollowedRepository } from "../../../repositories/FollowedRepository";


export class InMemoryFriendShipRepository implements FollowedRepository {
    constructor(
        private readonly db: Map<string, Followed>
    ) {}

    async create(followed: Followed): Promise<Followed> {
        this.db.set(followed.props.id, followed);
        return followed;
    }

    async getFollowByUsersId(senderId: string, recipientId: string): Promise<Followed> {
        const values = Array.from(this.db.values());
        const friendShip = values.find(v => v.props.recipientId === recipientId && 
                                            v.props.senderId === senderId);
        return friendShip;
    }

    async getFollowersByUsersId(id: string): Promise<Followed[]> {
        const values =  Array.from(this.db.values());
        return values.filter(elm => elm.props.recipientId === id || elm.props.senderId === id);
    }

    async getById(id: string): Promise<Followed> {
        return this.db.get(id);
    }

    async delete(id: string): Promise<void> {
        this.db.delete(id);
        return;
    }

}