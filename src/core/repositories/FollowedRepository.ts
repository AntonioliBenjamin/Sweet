import {Followed} from "../Entities/Followed";

type DeleteProperties = {
    addedBy: string
    userId: string
}

export interface FollowedRepository {
    create(followed: Followed): Promise<Followed>;

    getFollowingsByUserId(userId: string): Promise<string[]>;

    getFollowersByUserId(userId: string): Promise<string[]>;

    getMyFollows(userId: string): Promise<Followed[]>

    getById(id: string): Promise<Followed>;

    delete(deleteProperties: DeleteProperties): Promise<void>;

    deleteAllByUserId(id: string): Promise<void>;

    exists(userId: string, addedBy: string): Promise<Followed>;
}