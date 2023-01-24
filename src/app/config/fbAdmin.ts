import admin from "firebase-admin";

const googleCreadentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const serviceAccount = JSON.parse(
    Buffer.from(googleCreadentials, 'base64').toString('utf-8')
);
export const fbAdmin = admin.initializeApp({credential: admin.credential.cert(serviceAccount)});
