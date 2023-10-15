import { Router } from "express";
import * as controller from "../controllers/appController.js";
import ENV from "../config.js";

const router = Router();

// POST METHOD
router.route("/register").post(controller.register);
router.route("/login").post(controller.verifyUser, controller.login);

// GET METHOD
router
  .route("/user/:email")
  .get(controller.verifyToken, controller.getUser, (req, res) => res.end());
export default router;
