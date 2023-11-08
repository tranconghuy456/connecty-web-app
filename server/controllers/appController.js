import { UserModel } from "../models/User.model.js";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import ENV from "../config.js";
import jwt from "jsonwebtoken";
import { signAccessToken, signRefreshToken } from "../utils/useToken.js";

// POST: localhost:8080/api/register
// params: {firstname, lastname, birthday, username, email, password, role, isActived, createdAt, job, updatedAt, phone}
export async function register(req, res) {
  try {
    const { password, username, email, ...etc } = req.body;
    // check existance
    var isEmailExist = await UserModel.findOne({ email });
    var isUsernameExist = await UserModel.findOne({ username });
    // if exist
    if (isUsernameExist)
      return res.status(400).json({
        message: "The username is already in use.",
        data: { element: "username" },
      });
    else if (isEmailExist)
      return res.status(400).json({
        message: "The email is already in use.",
        data: { element: "email" },
      });

    // if not exist
    // hash password
    bcrypt.hash(password, ENV.SALT_ROUNDS).then((hashedPwd) => {
      let user = new UserModel({
        ...etc,
        username,
        email,
        password: hashedPwd,
      });

      // save user
      user
        .save()
        .then((result) => {
          // if success
          return res.status(201).json({
            message: "Register successfully.",
            data: { ...etc },
          });
        })
        // if failed
        .catch((error) => {
          return res.status(501).json({
            message: "Cannot save the User Profile.",
            data: error,
          });
        });
    });
    // register failed
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
      data: error,
    });
  }
}

// POST: localhost:8080/api/login
// params: {username, password}
export async function login(req, res) {
  try {
    const { username, password } = req.body;
    // checkpoint
    const user = await UserModel.findOne({ username });

    // compared password
    const comparedPwd = await bcrypt.compare(password, user.password);
    // if not match
    if (!comparedPwd)
      return res.status(401).json({
        message: "Username or Password is incorrect.",
        data: {
          element: "password",
        },
      });

    // if match
    // generate access token
    let refreshToken = await signRefreshToken(user._id.toHexString());
    let accessToken = await signAccessToken(refreshToken);
    // save refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login Successfully.",
      token: accessToken,
    });
  } catch (error) {
    // login failed
    return res.status(500).json({
      message: "Something went wrong.",
      data: error,
    });
  }
}

// Middleware for verify user
// POST || GET: localhost:8080/api/verifyUser
// params: {username}
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.params : req.body;

    // check user existance
    var isExist = await UserModel.findOne({ username });
    // if not exist
    if (!isExist)
      return res.status(404).json({
        message:
          "The username you entered doesn't belong to an account. Please check your username and try again.",
        data: {
          element: "Username",
        },
      });
    next();
  } catch (error) {
    // verify user failed
    return res.status(500).json({
      message: "Something went wrong.",
      data: error,
    });
  }
}
// Middleware for verify token
// POST || GET: localhost:8080/api/refresh
export async function verifyToken(req, res, next) {
  try {
    if (!req.headers["authorization"])
      return res.status(501).json({
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
            message: "Unauthorized.",
            data: {},
          });
        case "TokenExpiredError":
          // JWT expired
          // Re-generate access token
          const accessToken = await signAccessToken(
            req.cookies["refreshToken"] || null
          );
          if (!accessToken)
            return res.status(401).json({
              message: "Unauthorized.",
              data: {},
            });
          break;
      }
      next();
    });
  } catch (error) {
    // verify token failed
    return res.status(500).json({
      message: "Something went wrong.",
      data: error,
    });
  }
}

// GET: localhost:8080/api/user/:username
// params: {username}
export async function getUser(req, res) {
  try {
    const { username } = req.params;
    // invalid query
    if (!username)
      return res.status(501).json({
        message: "Invalid query.",
        data: username,
      });

    // if valid
    let user = await UserModel.findOne({ username });
    if (user) {
      let { password, ...data } = user._doc;

      return res.status(200).json({ data });
    } else {
      return res.status(404).json({
        message:
          "The username you entered doesn't belong to an account. Please check your username and try again.",
        element: "Username",
      });
    }
  } catch (error) {
    // get user failed
    return res.status(500).json({
      message: "Something went wrong.",
      data: error,
    });
  }
}

// GETgenerateOTP: localhost:8080/api/generateOTP
export async function generateOTP(req, res) {
  try {
    req.app.locals.OTP = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    return res.status(200).json({
      message: "Generate OTP successfully.",
      data: { code: req.app.locals.OTP },
    });
  } catch (error) {
    // get user failed
    return res.status(500).json({
      message: "Something went wrong.",
      data: error,
    });
  }
}

// GET: localhost:8080/api/verifyOTP
// params: {code}
export async function verifyOTP(req, res) {
  const { code } = req.query;

  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    // if true
    req.app.locals.OTP = null; // reset OTP
    // req.app.locals.resetSession = true; // start session for reset password

    return res.status(201).send({ message: "Verify successfully." });
  }
  return res.status(400).send({ message: "Invalid OTP." });
}

//
