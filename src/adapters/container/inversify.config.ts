import { Container } from "inversify";
import {Action, ClassConstructor, IocAdapter} from 'routing-controllers';
import {SignUp} from "../../core/usecases/user/SignUp";
import {SignIn} from "../../core/usecases/user/SignIn";
import {UpdateUser} from "../../core/usecases/user/UpdateUser";
import {UpdatePushToken} from "../../core/usecases/user/UpdatePushToken";
import {SendFeedback} from "../../core/usecases/user/SendFeeback";
import {ResetPassword} from "../../core/usecases/user/ResetPassword";
import {GetUserById} from "../../core/usecases/user/GetUserById";
import {GetAllMyPotentialFriends} from "../../core/usecases/user/GetAllMyPotentialFriends";
import {GenerateRecoveryCode} from "../../core/usecases/user/GenerateRecoveryCode";
import {EmailExist} from "../../core/usecases/user/EmailExist";
import {DeleteUser} from "../../core/usecases/user/DeleteUser";
import {identifiers} from "../../core/identifiers/identifiers";
import {UserRepository} from "../../core/repositories/UserRepository";
import {PollRepository} from "../../core/repositories/PollRepository";
import {AnswerRepository} from "../../core/repositories/AnswerRepository";
import {FollowedRepository} from "../../core/repositories/FollowedRepository";
import {QuestionRepository} from "../../core/repositories/QuestionRepository";
import {SchoolRepository} from "../../core/repositories/SchoolRepository";
import {PasswordGateway} from "../../core/gateways/PasswordGateway";
import {IdGateway} from "../../core/gateways/IdGateway";
import {PushNotificationGateway} from "../../core/gateways/PushNotificationGateway";
import {EmailGateway} from "../../core/gateways/EmailGateway";
import {MongoDbUserRepository} from "../repositories/mongoDb/repositories/MongoDbUserRepository";
import {MongoDbPollRepository} from "../repositories/mongoDb/repositories/MongoDbPollRepository";
import {MongoDbAnswerRepository} from "../repositories/mongoDb/repositories/MongoDbAnswerRepository";
import {MongoDbFollowRepository} from "../repositories/mongoDb/repositories/MongoDbFollowRepository";
import {MongoDbQuestionRepository} from "../repositories/mongoDb/repositories/MongoDbQuestionRepository";
import {SchoolDbRepository} from "../repositories/school/SchoolDbRepository";
import {V4IdGateway} from "../gateways/V4IdGateway";
import {FirebaseGateway} from "../gateways/FirebaseGateway";
import {SendGridGateway} from "../gateways/SendGridGateway";
import {BcryptGateway} from "../gateways/BcryptGateway";


       export const myContainer = new Container()
                myContainer.bind<SignUp>(identifiers.SignUp).to(SignUp);
        myContainer.bind<SignIn>(identifiers.SignIn).to(SignIn);
        myContainer.bind<UpdateUser>(identifiers.UpdateUser).to(UpdateUser);
        myContainer.bind<UpdatePushToken>(identifiers.UpdatePushToken).to(UpdatePushToken);
        myContainer.bind<SendFeedback>(identifiers.SendFeedBack).to(SendFeedback);
        myContainer.bind<ResetPassword>(identifiers.ResetPassword).to(ResetPassword);
        myContainer.bind<GetUserById>(identifiers.GetUserById).to(GetUserById);
        myContainer.bind<GetAllMyPotentialFriends>(identifiers.GetAllMyPotentialFriends).to(GetAllMyPotentialFriends);
        myContainer.bind<GenerateRecoveryCode>(identifiers.GenrateRecoveryCode).to(GenerateRecoveryCode);
        myContainer.bind<EmailExist>(identifiers.EmailExist).to(EmailExist);
        myContainer.bind<DeleteUser>(identifiers.DeleteUser).to(DeleteUser);

//repositories
        myContainer.bind<UserRepository>(identifiers.UserRepository).to(MongoDbUserRepository);
        myContainer.bind<PollRepository>(identifiers.PollRepository).to(MongoDbPollRepository);
        myContainer.bind<AnswerRepository>(identifiers.AnswerRepository).to(MongoDbAnswerRepository);
        myContainer.bind<FollowedRepository>(identifiers.FollowedRepository).to(MongoDbFollowRepository);
        myContainer.bind<QuestionRepository>(identifiers.QuestionRepository).to(MongoDbQuestionRepository);
        myContainer.bind<SchoolRepository>(identifiers.SchoolRepository).to(SchoolDbRepository);

//gateways
        myContainer.bind<PasswordGateway>(identifiers.PasswordGateway).to(BcryptGateway);
        myContainer.bind<IdGateway>(identifiers.IdGateway).to(V4IdGateway);
        myContainer.bind<PushNotificationGateway>(identifiers.PushNotificationGateway).to(FirebaseGateway);
        myContainer.bind<EmailGateway>(identifiers.EmailGateway).to(SendGridGateway);










