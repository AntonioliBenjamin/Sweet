import {Followed} from "../Entities/Followed";



export interface FollowedRepository {
    create(followed: Followed): Promise<Followed>;

    getMyFollows(userId: string): Promise<Followed[]>

    getById(id: string): Promise<Followed>;

    delete(userId : string, addedBy : string): Promise<void>;

    deleteAllByUserId(id: string): Promise<void>;

    exists(userId: string, addedBy: string): Promise<Followed>;
}