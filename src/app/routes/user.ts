
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
const userRouter = express.Router();
const secretKey = process.env.SECRET_KEY;
const mongoDbUserRepository = new MongoDbUserRepository();
const bcryptGateway = new BcryptGateway();
const v4IdGateway = new V4IdGateway();
const signUp = new SignUp(mongoDbUserRepository, v4IdGateway, bcryptGateway);
const signIn = new SignIn(mongoDbUserRepository, bcryptGateway);
const updateUser = new UpdateUser(mongoDbUserRepository);
const deleteUser = new DeleteUser(mongoDbUserRepository)

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

        const user = await signUp.execute(body);

        return res.status(201).send({
            id: user.props.id,
            userName: user.props.userName,
            email: user.props.email,
            created: user.props.createdAt,
        });
    } catch (err) {
        return res.status(400).send({
            message: err.message,
        });
    }
});

userRouter.post("/signIn", async (req, res) => {
    try {
        const body = {
            email: req.body.email.toLowerCase().trim(),
            password: req.body.password,
        };

        const user = await signIn.execute(body);
        const accessKey = jwt.sign(
            {
                id: user.props.id,
                schoolId: user.props.schoolId
            },
            secretKey
        );

        return res.status(200).send({
            id: user.props.id,
            userName: user.props.userName,
            email: user.props.email,
            createdAt: user.props.createdAt,
            updatedAt: user.props.updatedAt,
            accesskey: accessKey,
        });
    } catch (err) {
        return res.status(400).send({
            message: err.message,
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
            section: req.body.section
        };

        const updatedUser = await updateUser.execute({
            userName: body.userName,
            age: body.age,
            firstName: body.firstName,
            lastName: body.lastName,
            section: body.section,
            id: req.user.id

        });
        return res.status(200).send({
            id: updatedUser.props.id,
            userName: updatedUser.props.userName,
            email: updatedUser.props.email,
            createdAt: updatedUser.props.createdAt,
            updatedAt: updatedUser.props.updatedAt,
        });
    } catch (err) {
        return res.status(400).send({
            message: err.message,
        });
    }
});


userRouter.delete("/:id", async (req: AuthentifiedRequest, res) => {
    try {

        await deleteUser.execute({
            userId: req.user.id
        })
        return res.status(200).send({});
    } catch (err) {
        return res.status(400).send({
            message: err.message,
        })
    }
});


export {userRouter};
