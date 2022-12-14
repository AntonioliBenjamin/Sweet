import express from "express";
//import jwt from "jsonwebtoken";
//import { authorization } from "../middlewares/JwtAuthorizationMiddleware";
//import { AuthentifiedRequest } from "../types/AuthentifiedRequest";
const router = express.Router();
//const secretKey = process.env.SECRET_KEY;

//router.use(authorization);

router.get("/", async (req/*: AuthentifiedRequest*/, res) => {

})

router.post("/", async (req/*:AuthentifiedRequest*/, res) => {
    try {
        const body = {

        };

        // const accessKey = jwt.sign(
        //     {
        //         id: user.props.id,
        //         userName: user.props.userName,
        //         email: user.props.email,
        //         userLibraryId: user.props.libraryId,
        //     },
        //     secretKey
        // );

        return res.status(200).send({
            // id: user.props.id,
            // userName: user.props.userName,
            // email: user.props.email,
            // created: user.props.created,
            // accesskey: accessKey,
        });
    } catch (err) {
        return res.status(400).send({
            message: err.message,
        });
    }
})

export { router };



