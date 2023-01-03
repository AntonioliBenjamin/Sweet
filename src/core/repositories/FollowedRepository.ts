import {Followed} from "../Entities/Followed";

export interface FollowedRepository {
    create(followed: Followed): Promise<Followed>;

    getFollowingsByUserId(userId: string): Promise<string[]>;

    getFollowersByUserId(userId: string): Promise<string[]>;

    getMyFollows(userId: string): Promise<Followed[]>

    getById(id: string): Promise<Followed>;

    delete(id: string): Promise<void>;

    deleteAllByUserId(id: string): Promise<void>;

    exists(userId: string, addedBy: string): Promise<Followed>;
}