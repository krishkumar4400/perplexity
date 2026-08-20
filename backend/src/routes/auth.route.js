import { Router } from "express";
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  resendVerificationEmail,
  verifyEmail,
  getUser,
} from "../controllers/auth.controller.js";
import {
  authenticationMiddleware,
  isAuthenticated,
} from "../middlewares/auth.middleware.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/request.validator.js";

const authRouter = Router();

// public routes
authRouter.route("/register").post(registerValidator, registerUser);
authRouter.route("/login").post(loginValidator, loginUser);
authRouter.route("/verify-email").post(verifyEmail);

// protected routes
authRouter
  .route("/logout")
  .post(authenticationMiddleware, isAuthenticated, logoutUser);

authRouter
  .route("/user")
  .get(authenticationMiddleware, isAuthenticated, getUser);

authRouter
  .route("/resend-verification-email")
  .get(authenticationMiddleware, isAuthenticated, resendVerificationEmail);

export default authRouter;
