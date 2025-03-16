import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;

export const getToken = (payload) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: "1h",
  });
  return token;
};
