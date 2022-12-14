import {userModel} from "./../models/user";
import {User} from "./../../../../core/Entities/User";
import {Mapper} from "../../../../core/models/Mapper";

export class MongoDbUserMapper implements Mapper<userModel, User> {

    fromDomain(data: User): userModel {
        const {
            id,
            createdAt,
            email,
            password,
            updatedAt,
            userName,
            age,
            firstName,
            gender,
            lastName,
            schoolId,
            section
            
        } = data.props;
        return {
            id,
            createdAt: +createdAt,
            email,
            password,
            updatedAt: +updatedAt,
            userName,
            age,
            firstName,
            gender,
            lastName,
            schoolId,
            section
        }
    }

    toDomain(raw: userModel): User {
        const {
           id,
            createdAt,
            email,
            password,
            updatedAt,
            userName,
            age,
            firstName,
            gender,
            lastName,
            schoolId,
            section
        } = raw;
        return new User({
             id,
            createdAt : new Date(createdAt),
            email,
            password,
            updatedAt : new Date(updatedAt),
            userName,
            age,
            firstName,
            gender,
            lastName,
            schoolId,
            section
        });
    }
}