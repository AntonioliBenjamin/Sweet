import "dotenv/config";
import { Container } from "inversify";
import { BcryptGateway } from "../../adapters/gateways/BcryptGateway";
import { FirebaseGateway } from "../../adapters/gateways/FirebaseGateway";
import { SendGridGateway } from "../../adapters/gateways/SendGridGateway";
import { V4IdGateway } from "../../adapters/gateways/V4IdGateway";
import { MongoDbAnswerRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbAnswerRepository";
import { MongoDbFollowRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbFollowRepository";
import { MongoDbQuestionRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbQuestionRepository";
import { MongoDbUserRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";
import { SchoolDbRepository } from "../../adapters/repositories/school/SchoolDbRepository";
import { identifiers } from "../../core/identifiers/identifiers";
import { SignUp } from "../../core/usecases/user/SignUp";
import { UserController } from "../controllers/UserController";
import admin from "firebase-admin";
import { MailService } from "@sendgrid/mail";
import { MongoDbPollRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbPollRepository";
import { SignIn } from "../../core/usecases/user/SignIn";
import { UpdatePushToken } from "../../core/usecases/user/UpdatePushToken";
import { SendFeedback } from "../../core/usecases/user/SendFeeback";
import { ResetPassword } from "../../core/usecases/user/ResetPassword";
import { GetUserById } from "../../core/usecases/user/GetUserById";
import { GetAllMyPotentialFriends } from "../../core/usecases/user/GetAllMyPotentialFriends";
import { GenerateRecoveryCode } from "../../core/usecases/user/GenerateRecoveryCode";
import { EmailExist } from "../../core/usecases/user/EmailExist";
import { DeleteUser } from "../../core/usecases/user/DeleteUser";
import { UpdateUser } from "../../core/usecases/user/UpdateUser";
import { GetAllSchools } from "../../core/usecases/school/GetAllSchools";
import { SchoolController } from "../controllers/SchoolController";
import { CreateQuestion } from "../../core/usecases/question/CreateQuestion";
import { DeleteQuestion } from "../../core/usecases/question/DeleteQuestion";
import { GetAllQuestions } from "../../core/usecases/question/GetAllQuestions";
import { QuestionController } from "../controllers/QuestionController";
import { PollController } from "../controllers/Pollcontroller";
import { CreatePoll } from "../../core/usecases/poll/CreatePoll";
import { DeletePoll } from "../../core/usecases/poll/DeletePoll";
import { GetAllPolls } from "../../core/usecases/poll/GetAllPolls";
import { GetCurrentPoll } from "../../core/usecases/poll/GetCurrentPoll";
import { GetLastQuestionAnswered } from "../../core/usecases/answer/GetLastQuestionAnswered";
import { PollApiResponse } from "../dtos/PollApiResponse";
import { UserApiResponse } from "../dtos/UserApiUserMapper";
import { SearchFriends } from "../../core/usecases/friends/SearchFriends";
import { FriendsController } from "../controllers/FriendsController";
import { QuestionApiResponse } from "../dtos/QuestionApiResponse";

const googleCreadentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const serviceAccount = JSON.parse(
  Buffer.from(googleCreadentials, "base64").toString("utf-8")
);
const initialize = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const emailSender = process.env.RECOVERY_EMAIL_SENDER;
const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

export class PovKernel extends Container {
  init() {
    //repositories
    this.bind(identifiers.UserRepository).toConstantValue(
      new MongoDbUserRepository()
    );
    this.bind(identifiers.SchoolRepository).toConstantValue(
      new SchoolDbRepository()
    );
    this.bind(identifiers.QuestionRepository).toConstantValue(
      new MongoDbQuestionRepository()
    );
    this.bind(identifiers.AnswerRepository).toConstantValue(
      new MongoDbAnswerRepository()
    );
    this.bind(identifiers.FollowedRepository).toConstantValue(
      new MongoDbFollowRepository()
    );
    this.bind(identifiers.PollRepository).toConstantValue(
      new MongoDbPollRepository()
    );

    //gateways
    this.bind(identifiers.IdGateway).toConstantValue(new V4IdGateway());
    this.bind(identifiers.PasswordGateway).toConstantValue(new BcryptGateway());
    this.bind(identifiers.PushNotificationGateway).toConstantValue(
      new FirebaseGateway(initialize)
    );
    this.bind(identifiers.EmailSender).toConstantValue(emailSender);
    this.bind(identifiers.MailService).toConstantValue(mailService);
    this.bind(SendGridGateway).toSelf();
    this.bind(identifiers.EmailGateway).to(SendGridGateway);

    //usecases
    //user
    this.bind(SignUp).toSelf();
    this.bind(SignIn).toSelf();
    this.bind(UpdatePushToken).toSelf();
    this.bind(SendFeedback).toSelf();
    this.bind(ResetPassword).toSelf();
    this.bind(GetUserById).toSelf();
    this.bind(GetAllMyPotentialFriends).toSelf();
    this.bind(GenerateRecoveryCode).toSelf();
    this.bind(EmailExist).toSelf();
    this.bind(DeleteUser).toSelf();
    this.bind(UpdateUser).toSelf();
    //school
    this.bind(GetAllSchools).toSelf();
    //question
    this.bind(CreateQuestion).toSelf();
    this.bind(DeleteQuestion).toSelf();
    this.bind(GetAllQuestions).toSelf();
    //poll
    this.bind(CreatePoll).toSelf();
    this.bind(DeletePoll).toSelf();
    this.bind(GetAllPolls).toSelf();
    this.bind(GetCurrentPoll).toSelf();
    //answer
    this.bind(GetLastQuestionAnswered).toSelf();
    //friend
    this.bind(SearchFriends).toSelf();

    //controllers
    this.bind(UserController).toSelf();
    this.bind(SchoolController).toSelf()
    this.bind(QuestionController).toSelf();
    this.bind(PollController).toSelf();
    this.bind(FriendsController).toSelf();

    //API mappers
    this.bind(PollApiResponse).toConstantValue(new PollApiResponse());
    this.bind(UserApiResponse).toConstantValue(new UserApiResponse());
    this.bind(QuestionApiResponse).toConstantValue(new QuestionApiResponse());
  }
}
