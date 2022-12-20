import { Followed } from "../Entities/Followed";


export interface FollowedRepository {
    create(followed: Followed): Promise<Followed>;
    getFollowByUsersId(addedBy: string, userId: string): Promise<Followed>;
    getFollowersByUsersId(userId: string): Promise<Followed[]>;
    getById(id: string): Promise<Followed>;
    delete(id: string): Promise<void>
    deleteAllByUserId(id: string): Promise<void>
}