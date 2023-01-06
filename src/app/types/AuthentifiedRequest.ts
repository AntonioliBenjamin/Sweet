import {Request} from "express";

export interface AuthentifiedRequest extends Request {
    user: {
        id: string;
        schoolId: string;
        email: string;
    };
}
