import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY;

export function authorization(req, res, next) {
  try {
    const decodedJwt = jwt.verify(
      req.headers.access_key as string,
      secretKey
    ) as any;
    req.user = {
      id: decodedJwt.id,
      userName: decodedJwt.userName,
      email: decodedJwt.email,
    };
    return next();
  } catch (error) {
    return res.sendStatus(401);
  }
}
