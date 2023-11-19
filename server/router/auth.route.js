import { Router } from "express";
import * as controller from "../controllers/authController.js";
import * as middleware from "../middlewares/middlewares.js";

const router = Router();

// POST METHOD
router.route("/register").post(controller.register);
router.route("/login").post(middleware.verifyUser, controller.login);
router.route("/logout").post(controller.logout);

// GET METHOD
router
  .route("/users/:username")
  .get(middleware.verifyAccessToken, controller.getUser, (req, res) =>
    res.end()
  );
// router.route("/security/otp").get(controller.generateOTP, (req, res) => res.end());
// router.route("/security/token").get(controller.generateToken, (req, res) => res.end());

export default router;
