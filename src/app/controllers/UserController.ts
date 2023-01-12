import 'reflect-metadata';
import {Body, Delete, Get, JsonController, Param, Patch, Post, Req, Res, UseBefore} from "routing-controllers";
import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {SignUp} from "../../core/usecases/user/SignUp";
import {SignUpCommands} from "../commands/user/SignUpCommands";
import {SignInCommands} from "../commands/user/SignInCommands";
import {SignIn} from "../../core/usecases/user/SignIn";
import {RecoveryCommands} from "../commands/user/RecoveryCommands";
import {GenerateRecoveryCode} from "../../core/usecases/user/GenerateRecoveryCode";
import {ResetPasswordCommands} from "../commands/user/ResetPasswordCommands";
import {ResetPassword} from "../../core/usecases/user/ResetPassword";
import {EmailExistCommands} from "../commands/user/EmailExistCommands";
import {EmailExist} from "../../core/usecases/user/EmailExist";
import {SendFeedbackCommands} from "../commands/user/SendFeedbackCommands";
import {authorization} from "../middlewares/JwtAuthorizationMiddleware";
import {UpdateUserCommands} from "../commands/user/UpdateUserCommands";
import {UpdateUser} from "../../core/usecases/user/UpdateUser";
import {AuthentifiedRequest} from "../types/AuthentifiedRequest";
import {UpdatePushToken} from "../../core/usecases/user/UpdatePushToken";
import {GetUserById} from "../../core/usecases/user/GetUserById";
import {DeleteUser} from "../../core/usecases/user/DeleteUser";
import {GetAllMyPotentialFriends} from "../../core/usecases/user/GetAllMyPotentialFriends";
import {SendFeedback} from "../../core/usecases/user/SendFeeback";
import {PushTokenCommands} from "../commands/user/PushTokenCommands";
import {inject, injectable} from 'inversify';
import { UserApiResponse } from '../dtos/UserApiResponse';
import {EmailGateway} from "../../core/gateways/EmailGateway";
import {identifiers} from "../../core/identifiers/identifiers";

const userApiMapper = new UserApiResponse();

const secretKey = process.env.SECRET_KEY;

@injectable()
@JsonController('/user')
export class UserController {
    constructor(
        private readonly _signUp : SignUp,
        private readonly _signIn : SignIn,
        private readonly _updatePushToken : UpdatePushToken,
        private readonly _updateUser : UpdateUser,
        private readonly _sendFeedBack : SendFeedback,
        private readonly _resetPassword : ResetPassword,
        private readonly _getUserById : GetUserById,
        private readonly _getAllMyPotentialFriends : GetAllMyPotentialFriends,
        private readonly _generateRecoveryCode : GenerateRecoveryCode,
        private readonly _emailExist : EmailExist,
        private readonly _deleteUser : DeleteUser,
        @inject(identifiers.EmailGateway)
        private readonly _sendGridGateway : EmailGateway,
    ) {}

    @Post('/')
    async signUp(@Res() res: Response, @Body() cmd: SignUpCommands) {
        const body =  SignUpCommands.setProperties(cmd);

        const user = await this._signUp.execute(body);

        const accessKey = jwt.sign(
            {
                id: user.props.id,
                schoolId: user.props.schoolId,
                email: user.props.email,
            },
            secretKey
        );

        return res.status(201).send({
            ...userApiMapper.fromDomain(user),
            accessKey,
        });
    }

    @Post('/sign-in')
    async signIn(@Req() req: Request, @Res() res: Response, @Body() cmd: SignInCommands) {
        const body = await SignInCommands.setProperties(cmd);

        const user = await this._signIn.execute(body);

        const accessKey = jwt.sign(
            {
                id: user.props.id,
                schoolId: user.props.schoolId,
                email: user.props.email,
            },
            secretKey
        );

        return res.status(200).send({
            ...userApiMapper.fromDomain(user),
            accessKey,
        });
    }

    @Post('/password/recovery')
    async passwordRecovery(@Req() req: Request, @Res() res: Response, @Body() cmd: RecoveryCommands) {
        const body = await RecoveryCommands.setProperties(cmd);

        const user = await this._generateRecoveryCode.execute(body);

        const token = jwt.sign(
            {
                id: user.props.id,
                recoveryCode: user.props.recoveryCode,
            },
            secretKey,
            {expiresIn: "1h"}
        );

        await this._sendGridGateway.sendRecoveryCode({
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

        await this._resetPassword.execute({
            recoveryCode: decodedJwt.recoveryCode,
            password: body.password,
            id: decodedJwt.id,
        });

        return res.sendStatus(200);
    }

    @Post('/exist')
    async exist(@Req() req: Request, @Res() res: Response, @Body() cmd: EmailExistCommands) {
        const body = await EmailExistCommands.setProperties(cmd);

        const exist = await this._emailExist.execute(body.email);

        return res.send({
            exists: exist,
        });
    }

    @Post('/send-feedback')
    @UseBefore(authorization)
    async sendFeedback(@Req() req: AuthentifiedRequest, @Res() res: Response, @Body() cmd: SendFeedbackCommands) {
        const body = await SendFeedbackCommands.setProperties(cmd)

        await this._sendFeedBack.execute({
            email: body.email,
            message: body.message
        })
        return res.sendStatus(200)
    }

    @Patch('/')
    @UseBefore(authorization)
    async update(@Req() req: AuthentifiedRequest, @Res() res: Response, @Body() cmd: UpdateUserCommands) {
        const body = await UpdateUserCommands.setProperties(cmd);

        const updatedUser = await this._updateUser.execute({
            userName: body.userName,
            firstName: body.firstName,
            lastName: body.lastName,
            section: body.section,
            schoolId: body.schoolId,
            gender: body.gender,
            id: req.user.id,
        });

        return res.status(200).send(userApiMapper.fromDomain(updatedUser));
    }

    @Patch('/push-token')
    @UseBefore(authorization)
    async pushToken(
        @Req() req: AuthentifiedRequest,
        @Res() res: Response,
        @Body() cmd: PushTokenCommands
    ) {
        const body = await PushTokenCommands.setProperties({
            userId : req.user.id,
            pushToken : cmd.pushToken
        });
        const user = await this._updatePushToken.execute(body)

        return res.send(userApiMapper.fromDomain(user))
    }

    @Get('/all/:schoolId')
    @UseBefore(authorization)
    async getAllMyPotentialFriends(
        @Req() req: AuthentifiedRequest,
        @Res() res: Response,
        @Param("schoolId") schoolId: string
    ) {
        const users = await this._getAllMyPotentialFriends.execute(schoolId);

        const userResponse = users.map((elm) =>
            userApiMapper.fromDomain(elm)
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
        await this._deleteUser.execute({
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
        const user = await this._getUserById.execute({userId});

        return res.status(200).send(userApiMapper.fromDomain(user));
    }
}
