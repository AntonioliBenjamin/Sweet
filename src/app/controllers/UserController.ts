import 'reflect-metadata';
import {
    Body,
    Delete,
    Get,
    JsonController,
    Param,
    Patch,
    Post,
    Req,
    Res,
    UseBefore,
} from "routing-controllers";
import {UserApiResponse} from "../dtos/UserApiUserMapper";
import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {SignUpCommands} from "../commands/user/SignUpCommands";
import {SignInCommands} from "../commands/user/SignInCommands";
import {RecoveryCommands} from "../commands/user/RecoveryCommands";
import {SendGridGateway} from "../../adapters/gateways/SendGridGateway";
import {MailService} from "@sendgrid/mail";
import {ResetPasswordCommands} from "../commands/user/ResetPasswordCommands";
import {EmailExistCommands} from "../commands/user/EmailExistCommands";
import {SendFeedbackCommands} from "../commands/user/SendFeedbackCommands";
import {authorization} from "../middlewares/JwtAuthorizationMiddleware";
import {UpdateUserCommands} from "../commands/user/UpdateUserCommands";
import {AuthentifiedRequest} from "../types/AuthentifiedRequest";
import {SendFeedback} from "../../core/usecases/user/SendFeeback";
import {PushTokenCommands} from "../commands/user/PushTokenCommands";
import { myContainer} from "../../adapters/container/inversify.config";
import {identifiers} from "../../core/identifiers/identifiers";
import {SignUp} from "../../core/usecases/user/SignUp";
import {SignIn} from "../../core/usecases/user/SignIn";
import {GenerateRecoveryCode} from "../../core/usecases/user/GenerateRecoveryCode";
import {ResetPassword} from "../../core/usecases/user/ResetPassword";
import {EmailExist} from "../../core/usecases/user/EmailExist";
import {UpdateUser} from "../../core/usecases/user/UpdateUser";
import {DeleteUser} from "../../core/usecases/user/DeleteUser";
import {GetUserById} from "../../core/usecases/user/GetUserById";
import {GetAllMyPotentialFriends} from "../../core/usecases/user/GetAllMyPotentialFriends";
import {UpdatePushToken} from "../../core/usecases/user/UpdatePushToken";

const mailService = new MailService();
const emailSender = process.env.RECOVERY_EMAIL_SENDER;
const secretKey = process.env.SECRET_KEY;

const userApiResponse = new UserApiResponse();

const signUp = myContainer.get<SignUp>(identifiers.SignUp);
const signIn = myContainer.get<SignIn>(identifiers.SignIn);
const updateRecoveryCode = myContainer.get<GenerateRecoveryCode>(identifiers.GenrateRecoveryCode);
const resetPassword = myContainer.get<ResetPassword>(identifiers.ResetPassword);
const emailExist = myContainer.get<EmailExist>(identifiers.EmailExist);
const updateUser = myContainer.get<UpdateUser>(identifiers.UpdateUser);
const deleteUser = myContainer.get<DeleteUser>(identifiers.DeleteUser);
const getUserById = myContainer.get<GetUserById>(identifiers.GetUserById);
const getAllMyPotentialFriends = myContainer.get<GetAllMyPotentialFriends>(identifiers.GetAllMyPotentialFriends);
const updatePushtoken =myContainer.get<UpdatePushToken>(identifiers.UpdatePushToken);

const sendGridGateway = new SendGridGateway(mailService, emailSender);
const sendFeedback = new SendFeedback(sendGridGateway);

mailService.setApiKey(process.env.SENDGRID_API_KEY);

@JsonController('/user')
export class UserController {
    @Post('/')
    async signUp(@Req() req: Request, @Res() res: Response, @Body() cmd: SignUpCommands) {
        const body =  SignUpCommands.setProperties(cmd);

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
    }

    @Post('/sign-in')
    async signIn(@Req() req: Request, @Res() res: Response, @Body() cmd: SignInCommands) {
        const body = await SignInCommands.setProperties(cmd);

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
    }

    @Post('/password/recovery')
    async passwordRecovery(@Req() req: Request, @Res() res: Response, @Body() cmd: RecoveryCommands) {
        const body = await RecoveryCommands.setProperties(cmd);

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
    }

    @Post('/password/reset')
    async passwordReset(@Req() req: Request, @Res() res: Response, @Body() cmd: ResetPasswordCommands) {
        const body = await ResetPasswordCommands.setProperties(cmd);

        const decodedJwt = jwt.verify(body.token, secretKey) as any;

        await resetPassword.execute({
            recoveryCode: decodedJwt.recoveryCode,
            password: body.password,
            id: decodedJwt.id,
        });

        return res.sendStatus(200);
    }

    @Post('/exist')
    async exist(@Req() req: Request, @Res() res: Response, @Body() cmd: EmailExistCommands) {
        const body = await EmailExistCommands.setProperties(cmd);

        const exist = await emailExist.execute(body.email);

        return res.send({
            exists: exist,
        });
    }

    @Post('/send-feedback')
    @UseBefore(authorization)
    async sendFeedback(@Req() req: AuthentifiedRequest, @Res() res: Response, @Body() cmd: SendFeedbackCommands) {
        const body = await SendFeedbackCommands.setProperties(cmd)
        await sendFeedback.execute({
            email: body.email,
            message: body.message
        })
        return res.sendStatus(200)
    }

    @Patch('/')
    @UseBefore(authorization)
    async update(@Req() req: AuthentifiedRequest, @Res() res: Response, @Body() cmd: UpdateUserCommands) {
        const body = await UpdateUserCommands.setProperties(cmd);

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
    }

    @Patch('/push-token')
    @UseBefore(authorization)
    async pushToken(
        @Req() req: AuthentifiedRequest,
        @Res() res: Response,
        @Body() cmd: any
    ) {
        const body = await PushTokenCommands.setProperties({
            userId : req.user.id,
            pushToken : cmd.pushToken
        });
        const user = await updatePushtoken.execute(body)

        return res.send(userApiResponse.fromDomain(user))
    }

    @Get('/all/:schoolId')
    @UseBefore(authorization)
    async getAllSchools(
        @Req() req: AuthentifiedRequest,
        @Res() res: Response,
        @Param("schoolId") schoolId: string
    ) {
        const users = await getAllMyPotentialFriends.execute(schoolId);

        const userResponse = users.map((elm) =>
            userApiResponse.fromDomain(elm)
        );

        const ArrayWithoutCurrentUser = userResponse.filter(
            (elm) => elm.id !== req.user.id
        );

        return res.status(200).send(ArrayWithoutCurrentUser);
    }

    @Delete('/')
    @UseBefore(authorization)
    async delete(
        @Req() req: AuthentifiedRequest,
        @Res() res: Response,
    ) {
        await deleteUser.execute({
            userId: req.user.id,
        });

        return res.sendStatus(200);
    }

    @Get('/:userId')
    @UseBefore(authorization)
    async getById(
        @Req() req: AuthentifiedRequest,
        @Res() res: Response,
        @Param("userId") userId: string
    ) {
        const user = await getUserById.execute({userId});

        return res.status(200).send(userApiResponse.fromDomain(user));
    }
}
