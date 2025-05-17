import express from "express";
import {
  logoutHandler,
  signInHandler,
  signUpHandler,
  getCurrentUser,
  getUser,
  updateUser,
  listUsers,
  updateFriendShip,
} from "../controllers/user.js";
import { requireAuth } from "../middlewares/authorization.js";
const router = express.Router();

router.route("/signup").post(signUpHandler);
router.route("/login").post(signInHandler);
router.route("/logout").post(logoutHandler);
router.route("/get-current-user").get(requireAuth, getCurrentUser);
router.route("/get-user").get(requireAuth, getUser);
router.route("/list-users").get(requireAuth, listUsers);
router.route("/update").put(requireAuth, updateUser);
router.route("/update-friendship").put(requireAuth, updateFriendShip);

export default router;
