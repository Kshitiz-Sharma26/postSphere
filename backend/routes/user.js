import express from "express";
import {
  logoutHandler,
  signInHandler,
  signUpHandler,
} from "../controllers/user.js";
const router = express.Router();

router.route("/signup").post(signUpHandler);
router.route("/login").post(signInHandler);
router.route("/logout").post(logoutHandler);

export default router;
