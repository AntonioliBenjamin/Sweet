import {Request} from "express";

export interface AuthentifiedRequest extends Request {
    user: {
        id: string;
        userName: string;
        email: string;
    };
}
