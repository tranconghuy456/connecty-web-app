import { Router } from "express";
import * as controller from "../controllers/authController.js";
import * as middleware from "../middlewares/middlewares.js";

const router = Router();

// POST METHOD
router.route("/register").post(controller.register);
router.route("/login").post(middleware.verifyUser, controller.login);
router.route("/logout").post(controller.logout);

// // POST METHOD
// router.route("/register").post(controller.register);
// router.route("/login").post(controller.verifyUser, controller.login);

// // GET METHOD
// router
//   .route("/user/:username")
//   .get(controller.verifyToken, controller.getUser, (req, res) => res.end());

// router
//   .route("/authenticate/:username")
//   .get(controller.getUser, (req, res) => res.end()); // authenticate endpoint
// router.route("/generateOTP").get(controller.generateOTP);
export default router;
