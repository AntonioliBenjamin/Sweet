import { FriendShip } from "../../../Entities/FriendShip";
import { FriendShipRepository } from "../../../repositories/FriendShipRepository";

export class InMemoryFriendShipRepository implements FriendShipRepository {
    constructor(
        private readonly db: Map<string, FriendShip>
    ) {}

    async create(friendship: FriendShip): Promise<FriendShip> {
        this.db.set(friendship.props.id, friendship);
        return friendship;
    }

    async getFriendShipByUsersId(senderId: string, recipientId: string): Promise<FriendShip> {
        const values = Array.from(this.db.values());
        const friendShip = values.find(v => v.props.recipientId === recipientId && 
                                            v.props.senderId === senderId);
        return friendShip;
    }

    async getAllFriendShipsByUserId(id: string): Promise<FriendShip[]> {
        const values =  Array.from(this.db.values());
        return values.filter(elm => elm.props.recipientId === id || elm.props.senderId === id);
    }

    async getById(id: string): Promise<FriendShip> {
        return this.db.get(id);
    }

    async delete(id: string): Promise<void> {
        this.db.delete(id);
        return;
    }

}