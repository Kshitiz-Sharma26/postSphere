import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

export const requireAuth = async (req, resp, next) => {
  const token = req.cookies("auth_token");
  try {
    const user = jwt.verify(token, jwtSecret);
    req.user = user;
    next();
  } catch (error) {
    return resp.status(403).json({
      message: "User not authorized.",
    });
  }
};
