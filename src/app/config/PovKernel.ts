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
//import { UserController } from "../controllers/UserController";
import admin from "firebase-admin";
import {MailService} from "@sendgrid/mail";
import { MongoDbPollRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbPollRepository";
import {AnswerMarkAsRead} from "../../core/usecases/answer/AnswerMarkAsRead";
import {AnswerToQuestion} from "../../core/usecases/answer/AnswerToQuestion";
import {DeleteAnswer} from "../../core/usecases/answer/DeleteAnswer";
import {Delete} from "routing-controllers";
import {GetAllAnswers} from "../../core/usecases/answer/GetAllAnswers";
import {GetLastQuestionAnswered} from "../../core/usecases/answer/GetLastQuestionAnswered";
import {GetMyAnswers} from "../../core/usecases/answer/GetMyAnswers";
import {AnswerController} from "../controllers/AnswerController";
import {FollowUser} from "../../core/usecases/follow/FollowUser";
import {GetMyFollows} from "../../core/usecases/follow/GetMyFollows";
import {UnfollowUser} from "../../core/usecases/follow/UnfollowUser";
import {UserApiResponse} from "../dtos/UserApiUserMapper";
import {FollowController} from "../controllers/FollowController";
const googleCreadentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const serviceAccount = JSON.parse(Buffer.from(googleCreadentials, 'base64').toString('utf-8'));
const initialize = admin.initializeApp({credential: admin.credential.cert(serviceAccount)});
const emailSender = process.env.RECOVERY_EMAIL_SENDER;
const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);
export class PovKernel extends Container {
    init() {
        //repositories
        this.bind(identifiers.UserRepository).toConstantValue(new MongoDbUserRepository())
        this.bind(identifiers.SchoolRepository).toConstantValue(new SchoolDbRepository())
        this.bind(identifiers.QuestionRepository).toConstantValue(new MongoDbQuestionRepository())
        this.bind(identifiers.AnswerRepository).toConstantValue(new MongoDbAnswerRepository())
        this.bind(identifiers.FollowedRepository).toConstantValue(new MongoDbFollowRepository())
        this.bind(identifiers.PollRepository).toConstantValue(new MongoDbPollRepository())
        //gateways
        this.bind(identifiers.IdGateway).toConstantValue(new V4IdGateway())
        this.bind(identifiers.PasswordGateway).toConstantValue(new BcryptGateway())
        this.bind(identifiers.PushNotificationGateway).toConstantValue(new FirebaseGateway(initialize))
        this.bind(identifiers.EmailGateway).toConstantValue(new SendGridGateway(mailService, emailSender))
        //usecases
        this.bind(SignUp).toSelf()
        this.bind(AnswerMarkAsRead).toSelf();
        this.bind(AnswerToQuestion).toSelf();
        this.bind(DeleteAnswer).toSelf();
        this.bind(GetAllAnswers).toSelf();
        this.bind(GetLastQuestionAnswered).toSelf();
        this.bind(GetMyAnswers).toSelf();
        this.bind(FollowUser).toSelf();
        this.bind(GetMyFollows).toSelf();
        this.bind(UnfollowUser).toSelf();
        //controllers
       // this.bind(UserController).toSelf();
        this.bind(AnswerController).toSelf();
        this.bind(FollowController).toSelf();
        this.bind(UserApiResponse).toConstantValue(new UserApiResponse());

    }
}