import { UserModel } from "../models/User.model";
import bcrypt from "bcrypt";
import ENV from "../config.js";
import jwt from "jsonwebtoken";
import { signAccessToken } from "../utils/useToken";

// POST: localhost:8080/api/register
// params: {firstname, lastname, birthday, email, password, role, isActived, createdAt, job, updatedAt, phone}
export async function register(req, res) {
  try {
    const { password, email, ...etc } = req.body;
    console.table(req.body);
    // check user existance
    var isExist = await UserModel.findOne({ email });
    // if exist
    if (isExist)
      return res.status(400).json({
        error: true,
        message: "The email is already in use.",
        data: email,
      });

    // if not exist
    // hash password
    bcrypt.hash(password, ENV.SALT_ROUNDS).then((hashedPwd) => {
      let user = new UserModel({
        ...etc,
        email,
        password: hashedPwd,
      });

      // save user
      user
        .save()
        .then((result) => {
          // if success
          return res.status(201).json({
            error: false,
            message: "Register successfully.",
            data: { email, ...etc },
          });
        })
        // if failed
        .catch((error) => {
          return res.status(500).json({
            error: true,
            message: "Cannot save the User Profile.",
            data: error,
          });
        });
    });
    // register failed
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Something went wrong.",
      data: error,
    });
  }
}

// Middleware for verify user
// POST || GET: localhost:8080/api/verifyUser
// params: {email}
export async function verifyUser(req, res, next) {
  try {
    const { email } = req.method == "GET" ? req.params : req.body;

    // check user existance
    var isExist = await UserModel.findOne({ email });
    // if not exist
    if (!isExist)
      return res.status(404).json({
        error: true,
        message:
          "The Email you entered doesn't belong to an account. Please check your Email and try again.",
        data: email,
      });
    next();
  } catch (error) {
    // verify user failed
    return res.status(500).json({
      error: true,
      message: "Something went wrong.",
      data: error,
    });
  }
}
// Middleware for verify token
// POST || GET: localhost:8080/api/refresh
export async function verifyToken(req, res) {
  try {
    if (!req.headers["authoriztion"])
      return res.status(501).json({
        error: true,
        message: "Missing header query.",
        data: req.header,
      });
    // get token from header
    const token = req.headers["authorization"].split(" ")[1];
    // verify token
    jwt.verify(token, ENV.ACCESS_TOKEN_PRIVATE_KEY, async (error, payload) => {
      switch (error?.name) {
        case "JsonWebTokenError":
          //   JWT verify error
          return res.status(401).json({
            error: true,
            message: "Unauthorized.",
            data: {},
          });
        case "TokenExpiredError":
          // JWT expired
          // Re-generate access token
          const accessToken = await signAccessToken(
            req.cookies["refreshToken"]
          );
          break;
      }
    });
  } catch (error) {
    // verify token failed
    return res.status(500).json({
      error: true,
      message: "Something went wrong.",
      data: error,
    });
  }
}

// GET: localhost:8080/api/user/:email
// params: {email}
export async function getUser(req, res) {
  try {
    const { email } = req.params;
    // invalid query
    if (!email)
      return res.status(501).json({
        error: true,
        message: "Invalid query.",
        data: email,
      });

    // if valid
    let user = await UserModel.findOne({ email });
    return res.status(201).json({ user });
  } catch (error) {
    // get user failed
    return res.status(500).json({
      error: true,
      message: "Something went wrong.",
      data: error,
    });
  }
}
