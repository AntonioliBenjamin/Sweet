import { FriendShip } from "../Entities/FriendShip";

export interface FriendShipRepository {
    create(friendship: FriendShip): Promise<FriendShip>;
    getFriendShipByUsersId(senderId: string, recipientId: string): Promise<FriendShip>;
    getAllFriendShipsByUserId(userId: string): Promise<FriendShip[]>;
    getById(id: string): Promise<FriendShip>;
    delete(id: string): Promise<void>
}