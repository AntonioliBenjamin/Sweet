import { User } from "./../../core/Entities/User";
import { Mapper } from "./../../core/models/Mapper";

export type UserApiResponse = {
  id: string;
  userName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  lastName: string;
  gender: string;
  firstName: string;
  age: number;
  schoolId: string;
  section: string;
  pushToken: string;
};

export class UserApiUserMapper implements Mapper<UserApiResponse, User> {
  fromDomain(data: User): UserApiResponse {
    return {
      id: data.props.id,
      createdAt: data.props.createdAt,
      email: data.props.email,
      updatedAt: data.props.updatedAt,
      userName: data.props.userName,
      gender: data.props.gender,
      lastName: data.props.lastName,
      firstName: data.props.firstName,
      age: data.props.age,
      schoolId: data.props.schoolId,
      section: data.props.section,
      pushToken: data.props.pushToken
    };
  }
}
