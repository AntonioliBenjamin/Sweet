import { Container } from "inversify";
import { Answer } from "../../../Entities/Answer";
import { Followed } from "../../../Entities/Followed";
import { Poll } from "../../../Entities/Poll";
import { Question } from "../../../Entities/Question";
import { School } from "../../../Entities/School";
import { User } from "../../../Entities/User";
import { IdGateway } from "../../../gateways/IdGateway";
import { PasswordGateway } from "../../../gateways/PasswordGateway";
import { PushNotificationGateway } from "../../../gateways/PushNotificationGateway";
import { identifiers } from "../../../identifiers/identifiers";
import { AnswerRepository } from "../../../repositories/AnswerRepository";
import { FollowedRepository } from "../../../repositories/FollowedRepository";
import { PollRepository } from "../../../repositories/PollRepository";
import { QuestionRepository } from "../../../repositories/QuestionRepository";
import { SchoolRepository } from "../../../repositories/SchoolRepository";
import { UserRepository } from "../../../repositories/UserRepository";
import { DeleteUser } from "../../../usecases/user/DeleteUser";
import { EmailExist } from "../../../usecases/user/EmailExist";
import { GenerateRecoveryCode } from "../../../usecases/user/GenerateRecoveryCode";
import { GetAllMyPotentialFriends } from "../../../usecases/user/GetAllMyPotentialFriends";
import { GetUserById } from "../../../usecases/user/GetUserById";
import { ResetPassword } from "../../../usecases/user/ResetPassword";
import { SendFeedback } from "../../../usecases/user/SendFeeback";
import { SignIn } from "../../../usecases/user/SignIn";
import { SignUp } from "../../../usecases/user/SignUp";
import { UpdatePushToken } from "../../../usecases/user/UpdatePushToken";
import { UpdateUser } from "../../../usecases/user/UpdateUser";
import { BcryptGateway } from "../gateways/BcryptGateway";
import { FakeFirebaseGateway } from "../gateways/FakeFirebaseGateway";
import { UuidGateway } from "../gateways/UuidGateway";
import { InMemoryAnswerRepository } from "../repositories/InMemoryAnswerRepository";
import { InMemoryFollowRepository } from "../repositories/InMemoryFollowRepository";
import { InMemoryPollRepository } from "../repositories/InMemoryPollRepository";
import { InMemoryQuestionRepository } from "../repositories/InMemoryQuestionRepository";
import { InMemorySchoolRepository } from "../repositories/InMemorySchoolRepository";
import { InMemoryUserRepository } from "../repositories/InMemoryUserRepository";

export const testContainer = new Container()
export const userDb = new Map<string, User>()
export const pollDb = new Map<string, Poll>()
export const questionDb = new Map<string, Question>()
export const followDb = new Map<string, Followed>()
export const answerDb = new Map<string, Answer>()
export const schoolDb = new Map<string, School>()


//user usecases
testContainer.bind<SignUp>(identifiers.SignUp).to(SignUp);
testContainer.bind<SignIn>(identifiers.SignIn).to(SignIn);
testContainer.bind<UpdateUser>(identifiers.UpdateUser).to(UpdateUser);
testContainer.bind<UpdatePushToken>(identifiers.UpdatePushToken).to(UpdatePushToken);
testContainer.bind<SendFeedback>(identifiers.SendFeedBack).to(SendFeedback);
testContainer.bind<ResetPassword>(identifiers.ResetPassword).to(ResetPassword);
testContainer.bind<GetUserById>(identifiers.GetUserById).to(GetUserById);
testContainer.bind<GetAllMyPotentialFriends>(identifiers.GetAllMyPotentialFriends).to(GetAllMyPotentialFriends);
testContainer.bind<GenerateRecoveryCode>(identifiers.GenrateRecoveryCode).to(GenerateRecoveryCode);
testContainer.bind<EmailExist>(identifiers.EmailExist).to(EmailExist);
testContainer.bind<DeleteUser>(identifiers.DeleteUser).to(DeleteUser);

//repositories
testContainer.bind<UserRepository>(identifiers.UserRepository).toConstantValue(new InMemoryUserRepository(userDb));
testContainer.bind<PollRepository>(identifiers.PollRepository).toConstantValue(new InMemoryPollRepository(pollDb));
testContainer.bind<AnswerRepository>(identifiers.AnswerRepository).toConstantValue(new InMemoryAnswerRepository(answerDb));
testContainer.bind<FollowedRepository>(identifiers.FollowedRepository).toConstantValue(new InMemoryFollowRepository(followDb));
testContainer.bind<QuestionRepository>(identifiers.QuestionRepository).toConstantValue(new InMemoryQuestionRepository(questionDb));
testContainer.bind<SchoolRepository>(identifiers.SchoolRepository).toConstantValue(new InMemorySchoolRepository(schoolDb));

//gateways
testContainer.bind<PasswordGateway>(identifiers.PasswordGateway).to(BcryptGateway);
testContainer.bind<IdGateway>(identifiers.IdGateway).to(UuidGateway);
testContainer.bind<PushNotificationGateway>(identifiers.PushNotificationGateway).to(FakeFirebaseGateway);

