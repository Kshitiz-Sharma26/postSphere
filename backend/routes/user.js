import express from "express";
import {
  logoutHandler,
  signInHandler,
  signUpHandler,
  getCurrentUser,
} from "../controllers/user.js";
import { requireAuth } from "../middlewares/authorization.js";
const router = express.Router();

router.route("/signup").post(signUpHandler);
router.route("/login").post(signInHandler);
router.route("/logout").post(logoutHandler);
router.route("/get-current-user").get(requireAuth, getCurrentUser);

export default router;
