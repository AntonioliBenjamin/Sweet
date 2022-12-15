import { User } from './../../core/Entities/User';
import { Mapper } from './../../core/models/Mapper';

export type UserApiResponse = {
    id: string;
    userName: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export class UserApiUserMapper implements Mapper<UserApiResponse, User> {
    fromDomain(data: User): UserApiResponse {
        return {
            id: data.props.id,
            createdAt: data.props.createdAt,
            email: data.props.email,
            updatedAt: data.props.updatedAt,
            userName: data.props.userName
        }
    }
}