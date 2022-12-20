import { Followed } from "../../../Entities/Followed";
import { FollowedRepository } from "../../../repositories/FollowedRepository";

export class InMemoryFollowRepository implements FollowedRepository {
  constructor(private readonly db: Map<string, Followed>) {}

  async create(followed: Followed): Promise<Followed> {
    this.db.set(followed.props.id, followed);
    return followed;
  }

  async getFollowByUsersId(
    addedBy: string,
    userId: string
  ): Promise<Followed> {
    const values = Array.from(this.db.values());
    const follow = values.find(
      (v) =>
        v.props.userId === userId && v.props.addedBy === addedBy
    );
    return follow;
  }

  async getFollowersByUsersId(id: string): Promise<Followed[]> {
    const values = Array.from(this.db.values());
    return values.filter(
      (elm) => elm.props.userId === id || elm.props.addedBy === id
    );
  }

  async getById(id: string): Promise<Followed> {
    return this.db.get(id);
  }

  async delete(id: string): Promise<void> {
    this.db.delete(id);
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
}
