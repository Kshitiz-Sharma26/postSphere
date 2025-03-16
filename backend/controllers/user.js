import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { getToken } from "../utility/authorization.js";

export const signUpHandler = async (req, resp) => {
  const { username, password, profileImage } = req.body;
  try {
    await User.create({
      username,
      password,
      profileImage,
    });

    return resp.status(200).json({
      message: "New user created",
    });
  } catch (error) {
    let message = "Error while creating user";
    if (error.code === 11000) message = "User already exists";

    resp.status(404).json({
      message,
    });
  }
};

export const signInHandler = async (req, resp) => {
  const { password, username: reqUser } = req.body;
  try {
    const {
      username,
      _id,
      profileImage,
      password: hash,
    } = await User.getUser(reqUser);

    const compare = await bcrypt.compare(password, hash);

    if (compare) {
      // sign jwt token and return it in cookie
      const token = getToken({ username, profileImage, id: _id });
      resp.cookie("auth_token", token, {
        maxAge: 60 * 60 * 1000,
      });

      return resp.status(200).json({
        message: "User logged in",
      });
    }

    return resp.status(404).json({
      message: "Incorrect password",
    });
  } catch (error) {
    console.log(error);
    return resp.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logoutHandler = (req, resp) => {
  resp.clearCookie("auth_token");
  resp.status(200).json({
    message: "User logged out",
  });
};
