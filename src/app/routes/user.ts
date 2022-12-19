import { MailService } from "@sendgrid/mail";
import { ResetPassword } from "../../core/usecases/user/ResetPassword";
import { SendGridGateway } from "../../adapters/gateways/SendGridGateway";
import { GenerateRecoveryCode } from "../../core/usecases/user/GenerateRecoveryCode";
import { GetAllUsersBySchool } from "../../core/usecases/user/GetAllUsersBySchool";
import { UserApiUserMapper } from "../dtos/UserApiUserMapper";
import { SchoolDbRepository } from "../../adapters/repositories/school/SchoolDbRepository";
import express from "express";
import { BcryptGateway } from "../../adapters/gateways/BcryptGateway";
import { V4IdGateway } from "../../adapters/gateways/V4IdGateway";
import jwt from "jsonwebtoken";
import { authorization } from "../middlewares/JwtAuthorizationMiddleware";
import { AuthentifiedRequest } from "../types/AuthentifiedRequest";
import { SignUp } from "../../core/usecases/user/SignUp";
import { SignIn } from "../../core/usecases/user/SignIn";
import { UpdateUser } from "../../core/Usecases/user/UpdateUser";
import { DeleteUser } from "../../core/Usecases/user/DeleteUser";
import { MongoDbUserRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";
import { createValidator } from "express-joi-validation";
import { SignUpSchema } from "../commands/user/SignUpSchema";
import { SignInSchema } from "../commands/user/SignInSchema";
import { RecoverySchema } from "../commands/user/RecoverySchema";
import { ResetPasswordSchema } from "../commands/user/ResetPasswordSchema";
import { UpdateUserSchema } from "../commands/user/UpdateUserSchema";
import { GetAllUsersBySchoolIdSchema } from "../commands/user/GetAllUsersBySchoolIdSchema";
import { DeleteUserSchema } from "../commands/user/DeleteUserSchema";
const validator = createValidator();
const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);
const emailSender = process.env.RECOVERY_EMAIL_SENDER;
const userRouter = express.Router();
const secretKey = process.env.SECRET_KEY;
const schoolDbRepository = new SchoolDbRepository();
const mongoDbUserRepository = new MongoDbUserRepository();
const bcryptGateway = new BcryptGateway();
const v4IdGateway = new V4IdGateway();
const sendGridGateway = new SendGridGateway(mailService, emailSender);
const signUp = new SignUp(
  mongoDbUserRepository,
  schoolDbRepository,
  v4IdGateway,
  bcryptGateway
);
const signIn = new SignIn(mongoDbUserRepository, bcryptGateway);
const updateUser = new UpdateUser(mongoDbUserRepository);
const deleteUser = new DeleteUser(mongoDbUserRepository);
const getAllUsersBySchool = new GetAllUsersBySchool(mongoDbUserRepository);
const generateRecoveryCode = new GenerateRecoveryCode(
  mongoDbUserRepository,
  v4IdGateway
);
const resetPassword = new ResetPassword(mongoDbUserRepository);
const userApiUserMapper = new UserApiUserMapper();

userRouter.post("/signUp", async (req, res) => {
  try {
    const body = {
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      age: req.body.age,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      schoolId: req.body.schoolId,
      section: req.body.section,
      gender: req.body.gender,
    };
    const values = await SignUpSchema.validateAsync(body);
    const user = await signUp.execute(values);
    const accessKey = jwt.sign(
      {
        id: user.props.id,
        schoolId: user.props.schoolId,
        email: user.props.email,
      },
      secretKey
    );

    return res.status(201).send({
      ...userApiUserMapper.fromDomain(user),
      accessKey,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).send({
      message: "An error occurred",
    });
  }
});

userRouter.post("/signIn", async (req, res) => {
  try {
    const body = {
      email: req.body.email.toLowerCase().trim(),
      password: req.body.password,
    };

    const values = await SignInSchema.validateAsync(body);

    const user = await signIn.execute(values);
    const accessKey = jwt.sign(
      {
        id: user.props.id,
        schoolId: user.props.schoolId,
        email: user.props.email,
      },
      secretKey
    );

    return res.status(200).send({
      ...userApiUserMapper.fromDomain(user),
      accessKey,
    });
  } catch (err) {
    return res.status(400).send({
      message: "An error occurred",
    });
  }
});

userRouter.post("/recovery", async (req, res) => {
  try {
    const body = {
      email: req.body.email.toLowerCase().trim(),
    };
    const values = await RecoverySchema.validateAsync(body);
    const user = await generateRecoveryCode.execute(values);
    const token = jwt.sign(
      {
        id: user.props.id,
        recoveryCode: user.props.recoveryCode,
      },
      secretKey,
      { expiresIn: "1h" }
    );

    await sendGridGateway.sendRecoveryCode({
      email: user.props.email,
      resetLink: `http://localhost:3005/reset?trustedKey=${token}`,
      userName: user.props.userName,
    });

    return res.status(200).send(userApiUserMapper.fromDomain(user));
  } catch (err) {
    console.error(err);
    return res.status(400).send({
      message: "An error occurred",
    });
  }
});

userRouter.post("/resetPassword", async (req, res) => {
  try {
    const body = {
      password: req.body.password,
      token: req.body.token,
    };

    const values = await ResetPasswordSchema.validateAsync(body);

    const decodedJwt = jwt.verify(values.token, secretKey) as any;

    await resetPassword.execute({
      recoveryCode: decodedJwt.recoveryCode,
      password: values.password,
      id: decodedJwt.id,
    });

    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.status(400).send({
      message: "An error occurred",
    });
  }
});

userRouter.use(authorization);

userRouter.patch("/", async (req: AuthentifiedRequest, res) => {
  try {
    const body = {
      userName: req.body.userName.trim(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      section: req.body.section,
    };

    const values = await UpdateUserSchema.validateAsync(body);

    const updatedUser = await updateUser.execute({
      userName: values.userName,
      age: values.age,
      firstName: values.firstName,
      lastName: values.lastName,
      section: values.section,
      id: req.user.id,
    });

    return res.status(200).send(userApiUserMapper.fromDomain(updatedUser));
  } catch (err) {
    return res.status(400).send({
      message: "An error occurred",
    });
  }
});

userRouter.get(
  "/all/:schoolId",
  validator.params(GetAllUsersBySchoolIdSchema),
  async (req, res) => {
    try {
      const users = await getAllUsersBySchool.execute(req.params.schoolId);

      return res
        .status(200)
        .send(users.map((elm) => userApiUserMapper.fromDomain(elm)));
    } catch (err) {
      return res.status(400).send({
        message: "An error occurred",
      });
    }
  }
);

userRouter.delete(
  "/:id",
  validator.params(DeleteUserSchema),
  async (req: AuthentifiedRequest, res) => {
    try {
      await deleteUser.execute({
        userId: req.user.id,
      });
      return res.status(200).send({});
    } catch (err) {
      return res.status(400).send({
        message: "An error occurred",
      });
    }
  }
);

export { userRouter };
