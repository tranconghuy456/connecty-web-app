import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import * as userController from "../controllers/user.controller.js";
import * as middleware from "../middlewares/root.js";

export const userRouter = Router();

// default user route
userRouter
  .route("/")
  .post(middleware.verifyUserByUsername, (req, res) =>
    res.sendStatus(200).end()
  );

userRouter
  .route("/login")
  .post(middleware.verifyUserByUsername, authController.login);
userRouter.route("/register").post(authController.register);

userRouter
  .route("/:username")
  .get(middleware.verifyAccessToken, userController.getUser)
  .post(middleware.verifyUserByUsername, (req, res) =>
    res.sendStatus(200).end()
  );

userRouter
  .route("/recover")
  .post(middleware.verifyOTP, authController.recover, (req, res) => res.end());
