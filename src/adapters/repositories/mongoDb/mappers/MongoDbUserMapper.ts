import { userModel } from "./../models/user";
import { User } from "./../../../../core/Entities/User";
import { Mapper } from "../../../../core/models/Mapper";

export class MongoDbUserMapper implements Mapper<userModel, User> {
  fromDomain(data: User): userModel {
    return {
      id: data.props.id,
      email: data.props.email,
      age: data.props.age,
      firstName: data.props.firstName,
      gender: data.props.gender,
      lastName: data.props.lastName,
      password: data.props.password,
      schoolId: data.props.schoolId,
      section: data.props.section,
      createdAt: +data.props.createdAt,
      userName: data.props.userName,
      recoveryCode: data.props.recoveryCode,
      updatedAt: +data.props.updatedAt,
      pushToken: data.props.pushToken
    };
  }

  toDomain(raw: userModel): User {
    return new User({
      id: raw.id,
      email: raw.email,
      age: raw.age,
      firstName: raw.firstName,
      gender: raw.gender,
      lastName: raw.lastName,
      password: raw.password,
      schoolId: raw.schoolId,
      section: raw.section,
      createdAt: new Date(raw.createdAt),
      userName: raw.userName,
      recoveryCode: raw.recoveryCode,
      updatedAt: new Date(raw.updatedAt),
      pushToken: raw.pushToken
    });
  }
}
