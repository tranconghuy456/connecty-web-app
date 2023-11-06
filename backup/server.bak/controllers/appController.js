import { UserModel, UserTokenModel } from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import ENV from "../config.js";
import generateTokens from "../utils/generateTokens.js";

// POST: localhost:8080/api/register
// { firstname, lastname, email, password, birthday, phone }
export async function register(req, res) {
  try {
    const { firstname, lastname, email, password, birthday, phone } = req.body;

    // finding user
    let existEmail = await UserModel.findOne({ email });
    if (existEmail) {
      // if exist
      return res.status(400).send({
        message: "The email is already in use. Please use unique email.",
      });
    }

    // if not exist
    if (password) {
      bcrypt.hash((hashedPwd) => {
        // set user profile
        let user = new UserModel({
          firstname,
          lastname,
          email,
          password: hashedPwd,
          birthday,
          phone: phone || 123,
        });

        // save user
        user
          .save()
          .then((result) => {
            return res.status(201).send({ message: "Register Successfully." });
          })
          .catch((error) => {
            return res.status(500).send({
              message: "Cannot save the User Profile. Please try again.",
            });
          });
      });
    }
  } catch (error) {
    // register failed
    return res
      .status(500)
      .send({ message: "Something went wrong. Please try again." });
  }
}

// POST: localhost:8080/api/login
// {email, password}
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    // finding user
    let user = await UserModel.findOne({ email });
    // if not exist
    if (!user)
      return res
        .status(401)
        .json({ error: true, message: "Invalid Email or Password." });

    // compare password
    const verifiedPwd = await bcrypt.compare(password, user.password);
    // if not match
    if (!verifiedPwd)
      res
        .status(401)
        .json({ error: true, message: "Invaild Email or Password." });

    // if match
    const { accessToken, refreshToken } = await generateTokens(user);
    // re-declare user data
    var { password, ...etc } = user;

    return res.status(200).send({
      message: "Login Successfully.",
      data: etc,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    // auth failed
    return res
      .status(500)
      .send({ message: "Something went wrong. Please try again." });
  }
}

// Middleware for verify user
// POST || GET: localhost:8080/api/verifyUser
// {email}
export async function verifyUser(req, res, next) {
  try {
    const { email } = req.method == "GET" ? req.query : req.body;
    let existEmail = await UserModel.findOne({ email });

    if (!existEmail) {
      // if not exist
      return res.status(400).send({
        message:
          "The Email you entered doesn't belong to an account. Please check your Email and try again.",
      });
    }
    next();
  } catch (error) {
    // verify failed
    return res.status(500).send({
      message: "Something went wrong. Please try again.",
    });
  }
}

// Middleware for generate access token
// POST: localhost:8080/api/refresh
// {refreshToken}
export async function refresh(req, res, next) {
  try {
  } catch (error) {}
}

// // Re-generate access token
// router.post("/", async (req, res) => {
//   // verify refresh token
//   verifyRefreshToken(req.body.refreshToken)
//     .then(({ tokenDetails }) => {
//       const payload = { _id: tokenDetails._id, role: tokenDetails.role };
//       const accessToken = jwt.sign(payload, ENV.ACCESS_TOKEN_PRIVATE_KEY, {
//         expiresIn: "14m",
//       });

//       return res.status(200).json({
//         error: false,
//         accessToken,
//         message: "Access token created successfully.",
//       });
//     })
//     .catch((error) => {
//       return res.status(400).json(error);
//     });
// });

// GET: localhost:8080/api/user/@email
// {email}
export async function getUser(req, res) {
  try {
    const { email } = req.params;
    if (!email) {
      // invalid query
      return res.status(501).send({
        message: "Invalid query.",
      });
    }

    // if valid
    UserModel.findOne({ emai })
      .then((user) => {
        if (!user) {
          //if not exist
          return res.status(400).send({
            message: "User not found.",
          });
        }

        // if exist
        return res.status(201).send(user);
      })
      .catch(() => {
        // db error
        return res
          .status(500)
          .send({ message: "Database Error. Please try again." });
      });
  } catch (error) {
    // get failed
    return res.status(500).send({
      message: "Something went wrong. Please try again.",
    });
  }
}
