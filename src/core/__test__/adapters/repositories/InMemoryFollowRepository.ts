import {Followed} from "../../../Entities/Followed";
import {FollowedRepository} from "../../../repositories/FollowedRepository";
import {DeleteFollowProperties} from "../../../usecases/follow/UnfollowUser";

export class InMemoryFollowRepository implements FollowedRepository {
    constructor(
        private readonly db: Map<string, Followed>
    ) {
    }

    async create(followed: Followed): Promise<Followed> {
        this.db.set(followed.props.id, followed);

        return followed;
    }

    async getFollowersByUserId(userId: string): Promise<string[]> {
        const values = Array.from(this.db.values());

        const follows = values.filter(
            (elm) => elm.props.userId === userId
        );

        return follows.map(elm => elm.props.addedBy);
    }

    async getFollowingsByUserId(userId: string): Promise<string[]> {
        const values = Array.from(this.db.values());

        const follows = values.filter(
            (elm) => elm.props.addedBy === userId
        );

        return follows.map(elm => elm.props.userId);
    }

    async getById(id: string): Promise<Followed> {
        return this.db.get(id);
    }

    async delete(userId : string, addedBy : string): Promise<void> {
        this.db.delete("0000");

        return;
    }

    async deleteAllByUserId(userId: string): Promise<void> {
        const values = Array.from(this.db.values());

        const match = values.filter(
            (elm) => elm.props.userId === userId || elm.props.addedBy === userId
        );
        match.map((elm) => this.db.delete(elm.props.id));

        return;
    }

    async exists(userId: string, addedBy: string): Promise<Followed> {
        const values = Array.from(this.db.values());

        return values.find(
            elm => elm.props.addedBy === userId && elm.props.userId === addedBy
                || elm.props.addedBy === addedBy && elm.props.userId === userId
        )
    }

    async getMyFollows(userId: string): Promise<Followed[]> {
        const values = Array.from(this.db.values());
        const follows = values.filter(elm => elm.props.addedBy === userId || elm.props.userId === userId) 
        return follows
    }
}
