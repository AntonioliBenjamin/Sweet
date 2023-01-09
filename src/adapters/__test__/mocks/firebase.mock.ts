import * as admin from "firebase-admin";

export const app = admin.initializeApp();

jest.mock('firebase-admin', () => {
    return {
        initializeApp: jest.fn().mockImplementation(() => {
            return {
                messaging: jest.fn(() => {
                    return {
                        send: jest.fn().mockImplementation((...args) => {
                            const token = args[0].token;
                            if (!token) {
                                throw new Error('TOKEN_INVALID');
                            }
                            return args;
                        })
                    }
                })
            }
        })
    }
})