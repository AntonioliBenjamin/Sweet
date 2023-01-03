import { User } from "../Entities/User";

export interface UserRepository {
  create(input: User): Promise<User>;

  getByEmail(email: string): Promise<User>;

  getById(userId: string): Promise<User>;

  getAllUsersBySchool(schoolId: string): Promise<User[]>;

  update(input: User): Promise<User>;

  delete(userId: string): Promise<void>;

  updatePassword(user: User): Promise<void>;

  searchFriends(keyword: string, schoolId?: string): Promise<User[]>

  updatePushtoken(user: User): Promise<User>

  getByIdArray(array: string[]): Promise<User[]>
}
