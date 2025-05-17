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
    const user = await User.findOne({ username: reqUser });
    if (!user)
      return resp.status(404).json({
        message: "User doesnot exists.",
      });
    const { username, _id, profileImage, password: hash } = user;
    const compare = await bcrypt.compare(password, hash);

    if (compare) {
      // sign jwt token and return it in cookie
      const token = getToken({ username, profileImage, id: _id });
      resp.cookie("auth_token", token, {
        maxAge: 60 * 60 * 1000,
        secure: true,
        sameSite: "none",
      });

      return resp.status(200).json({
        message: "User logged in",
        data: {
          username,
        },
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

export const getCurrentUser = (req, resp) => {
  return resp.status(200).json({
    message: "User authenticated.",
    data: req.user,
  });
};

export const getUser = async (req, resp) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return resp.status(404).json({
        message: "User not found.",
      });
    }

    return resp.status(200).json({
      message: "User found.",
      data: {
        username,
        profileImage: user.profileImage,
        bio: user.bio,
        id: user.id,
        friends: user.friends,
      },
    });
  } catch (error) {
    return resp.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const updateUser = async (req, resp) => {
  const { id, payload } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, payload);
    if (!user) {
      return resp.status(404).json({
        message: "User not found.",
      });
    }
    return resp.status(200).json({
      message: "User infomation update.",
    });
  } catch (error) {
    return resp.status(500).json({
      message: "Internal server error",
    });
  }
};

export const listUsers = async (req, resp) => {
  const { searchKey } = req.query;
  try {
    const users = await User.find({
      username: {
        $regex: `^${searchKey}`, // \b = word boundary
        $options: "i",
      },
    });
    const processedUsers = users.map((user) => ({
      username: user.username,
      id: user.id,
      profileImage: user.profileImage,
    }));

    return resp.status(200).json({
      message: "Users found.",
      data: processedUsers,
    });
  } catch (error) {
    return resp.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const updateFriendShip = async (req, res) => {
  const { requestedBy, requestedTo, add } = req.body;

  try {
    const updateAction = add ? "$push" : "$pull";

    const [result1, result2] = await Promise.all([
      User.updateOne(
        { _id: requestedBy },
        { [updateAction]: { friends: requestedTo } }
      ),
      User.updateOne(
        { _id: requestedTo },
        { [updateAction]: { friends: requestedBy } }
      ),
    ]);

    if (result1.modifiedCount === 0 || result2.modifiedCount === 0) {
      throw new Error("No documents were modified");
    }

    return res.status(200).json({
      success: true,
      message: `Friend ${add ? "added" : "removed"} successfully`,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to update friendship",
    });
  }
};
