import { Router } from "express";
import * as controller from "../controllers/appController.js";
import verifyRefreshToken from "../utils/verifyRefreshToken.js";
import ENV from "../config.js";

const router = Router();

// POST Request
router.route("/register").post(controller.register);
router.route("/authenticate").post(controller.verifyUser);
router.route("/login").post(controller.login);

// GET request
router.route("/user/@:email").get(controller.verifyToken, controller.getUser);

export default router;
