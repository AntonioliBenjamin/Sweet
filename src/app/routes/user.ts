import {MailService} from "@sendgrid/mail";
import {ResetPassword} from "../../core/usecases/user/ResetPassword";
import {SendGridGateway} from "../../adapters/gateways/SendGridGateway";
import {GenerateRecoveryCode} from "../../core/usecases/user/GenerateRecoveryCode";
import {GetAllMyPotentialFriends} from "../../core/usecases/user/GetAllMyPotentialFriends";
import {UserApiResponse} from "../dtos/UserApiUserMapper";
import {SchoolDbRepository} from "../../adapters/repositories/school/SchoolDbRepository";
import express from "express";
import {BcryptGateway} from "../../adapters/gateways/BcryptGateway";
import {V4IdGateway} from "../../adapters/gateways/V4IdGateway";
import jwt from "jsonwebtoken";
import {authorization} from "../middlewares/JwtAuthorizationMiddleware";
import {AuthentifiedRequest} from "../types/AuthentifiedRequest";
import {SignUp} from "../../core/usecases/user/SignUp";
import {SignIn} from "../../core/usecases/user/SignIn";
import {UpdateUser} from "../../core/Usecases/user/UpdateUser";
import {DeleteUser} from "../../core/Usecases/user/DeleteUser";
import {MongoDbUserRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";
import {MongoDbFollowRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbFollowRepository";
import {MongoDbAnswerRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbAnswerRepository";
import {EmailExist} from "../../core/usecases/user/EmailExist";
import {UpdatePushToken} from "../../core/usecases/user/UpdatePushToken";
import {SignUpCommands} from "../commands/user/SignUpCommands";
import {SignInCommands} from "../commands/user/SignInCommands";
import {UpdateUserCommands} from "../commands/user/UpdateUserCommands";
import {RecoveryCommands} from "../commands/user/RecoveryCommands";
import {ResetPasswordCommands} from "../commands/user/ResetPasswordCommands";
import {EmailExistCommands} from "../commands/user/EmailExistCommands";
import {GetUserById} from "../../core/usecases/user/GetUserById";
import {SendFeedbackCommands} from "../commands/user/SendFeedbackCommands";
import {SendFeedback} from "../../core/usecases/user/SendFeeback";
import { User } from "../../core/Entities/User";

const mailService = new MailService();
const emailSender = process.env.RECOVERY_EMAIL_SENDER;
const userRouter = express.Router();
const secretKey = process.env.SECRET_KEY;
const schoolDbRepository = new SchoolDbRepository();
const mongoDbUserRepository = new MongoDbUserRepository();
const mongoDbAnswerRepository = new MongoDbAnswerRepository();
const mongoDbFollowRepository = new MongoDbFollowRepository();
const bcryptGateway = new BcryptGateway();
const v4IdGateway = new V4IdGateway();
const sendGridGateway = new SendGridGateway(mailService, emailSender);
const signUp = new SignUp(mongoDbUserRepository, schoolDbRepository, v4IdGateway, bcryptGateway);
const signIn = new SignIn(mongoDbUserRepository, bcryptGateway);
const updateUser = new UpdateUser(mongoDbUserRepository, schoolDbRepository);
const deleteUser = new DeleteUser(mongoDbUserRepository, mongoDbFollowRepository, mongoDbAnswerRepository);
const getUserById = new GetUserById(mongoDbUserRepository)
const emailExist = new EmailExist(mongoDbUserRepository);
const getAllMyPotentialFriends = new GetAllMyPotentialFriends(mongoDbUserRepository);
const updateRecoveryCode = new GenerateRecoveryCode(mongoDbUserRepository, v4IdGateway);
const resetPassword = new ResetPassword(mongoDbUserRepository, bcryptGateway);
const updatePushtoken = new UpdatePushToken(mongoDbUserRepository);
const userApiResponse = new UserApiResponse();

const sendFeedBack = new SendFeedback(sendGridGateway)

mailService.setApiKey(process.env.SENDGRID_API_KEY);

userRouter.post("/", async (req, res) => {
    const body = await SignUpCommands.setProperties({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        schoolId: req.body.schoolId,
        section: req.body.section,
        gender: req.body.gender,
    });

    const user = await signUp.execute(body);

    const accessKey = jwt.sign(
        {
            id: user.props.id,
            schoolId: user.props.schoolId,
            email: user.props.email,
        },
        secretKey
    );

    return res.status(201).send({
        ...userApiResponse.fromDomain(user),
        accessKey,
    });
});

userRouter.post("/sign-in", async (req, res) => {
    const body = await SignInCommands.setProperties({
        email: req.body.email.toLowerCase().trim(),
        password: req.body.password,
    });

    const user = await signIn.execute(body);

    const accessKey = jwt.sign(
        {
            id: user.props.id,
            schoolId: user.props.schoolId,
            email: user.props.email,
        },
        secretKey
    );

    return res.status(200).send({
        ...userApiResponse.fromDomain(user),
        accessKey,
    });
});

userRouter.post("/password/recovery", async (req, res) => {

    const body = await RecoveryCommands.setProperties({
        email: req.body.email.toLowerCase().trim(),
    });

    const user = await updateRecoveryCode.execute(body);

    const token = jwt.sign(
        {
            id: user.props.id,
            recoveryCode: user.props.recoveryCode,
        },
        secretKey,
        {expiresIn: "1h"}
    );

    await sendGridGateway.sendRecoveryCode({
        email: user.props.email,
        resetLink: `http://localhost:3005/views/reset?trustedKey=${token}`,
        userName: user.props.userName,
    });

    return res.sendStatus(200);
});

userRouter.post("/password/reset", async (req, res) => {

    const body = await ResetPasswordCommands.setProperties({
        password: req.body.password,
        token: req.body.token,
    });

    const decodedJwt = jwt.verify(body.token, secretKey) as any;

    await resetPassword.execute({
        recoveryCode: decodedJwt.recoveryCode,
        password: body.password,
        id: decodedJwt.id,
    });

    return res.sendStatus(200);
});

userRouter.post("/exist", async (req, res) => {
    const body = await EmailExistCommands.setProperties({
        email: req.body.email.toLowerCase().trim(),
    });

    const exist = await emailExist.execute(body.email);

    return res.send({
        exists: exist,
    });
});

userRouter.use(authorization);

userRouter.post("/send-feedback", async (req: AuthentifiedRequest, res) => {
    const body = await SendFeedbackCommands.setProperties({
        email: req.user.email,
        message: req.body.message
    })

    await sendFeedBack.execute({
        email: body.email,
        message: body.message
    })

    return res.sendStatus(200)
})

userRouter.patch("/", async (req: AuthentifiedRequest, res) => {
    const body = await UpdateUserCommands.setProperties({
        userName: req.body.userName.trim(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        section: req.body.section,
        gender: req.body.gender,
        schoolId: req.body.schoolId
    });

    const updatedUser = await updateUser.execute({
        userName: body.userName,
        firstName: body.firstName,
        lastName: body.lastName,
        section: body.section,
        schoolId: body.schoolId,
        gender: body.gender,
        id: req.user.id,
    });

    return res.status(200).send(userApiResponse.fromDomain(updatedUser));
});

userRouter.patch("/push-token", async (req: AuthentifiedRequest, res) => {

    const body = {
        userId: req.user.id,
        pushToken: req.body.pushToken
    }

    const user = await updatePushtoken.execute(body)

    return res.send(userApiResponse.fromDomain(user))
})

userRouter.get("/all/:schoolId", async (req: AuthentifiedRequest, res) => {
    const users = await getAllMyPotentialFriends.execute(req.params.schoolId);
    
    const userResponse = users.map((elm) =>
        userApiResponse.fromDomain(elm)
    );

    const ArrayWithoutCurrentUser = userResponse.filter(
        (elm) => elm.id !== req.user.id
    );

    return res.status(200).send(ArrayWithoutCurrentUser);
});

userRouter.delete("/", async (req: AuthentifiedRequest, res) => {
    await deleteUser.execute({
        userId: req.user.id,
    });

    return res.sendStatus(200);
});

userRouter.get("/:userId", async (req: AuthentifiedRequest, res) => {
    const user = await getUserById.execute({
        userId: req.params.userId,
    });

    return res.status(200).send(userApiResponse.fromDomain(user));
});

export {userRouter};
