import { UserModel } from "../models/user.model.js";
import { comparePassword, hashPassword } from "../utils/hashing.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import * as ENV from "../configs/root.js";

const register = async (req, res) => {
  try {
    let data = req.body;

    // checking existance
    let user = await UserModel.findOne({ email: data.email });
    // if email is exist
    if (user) {
      return res.status(409).json({
        status: "error",
        errors: [
          {
            message: "The Email is already in use",
            code: 409,
            field: "email",
          },
        ],
      });
    } else if (user && user.username) {
      // if username is exist
      return res.status(409).json({
        status: "error",
        errors: [
          {
            message: "The Username is already in use",
            code: 409,
            field: "username",
          },
        ],
      });
    }
    // passed
    // hash password
    let hashedPwd = await hashPassword(
      data.password,
      ENV.SECURITY["SALT_ROUNDS"]
    );
    // push profile to db
    new UserModel({
      ...data,
      password: hashedPwd,
    })
      .save()
      .then(() => {
        let { password, ...next } = data;
        // if succeed
        return res.sendStatus(201).end();
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      errors: [
        {
          message: "Internal server error",
          code: 500,
          data: error,
        },
      ],
    });
  }
};

const login = async (req, res) => {
  try {
    let data = req.body;

    // if invalid data
    if (!data.username) {
      return res.status(400).json({
        status: "error",
        errors: [
          {
            message: "Invalid param(s)",
            code: 400,
            field: "username",
          },
        ],
      });
    }

    // if valid
    // define user
    let user = await UserModel.findOne({ username: data.username });
    // if undefined user
    if (!user) {
      return res.status(404).json({
        status: "error",
        errors: [
          {
            message: "The Username you entered doens't belong to any account",
            code: 404,
            field: "username",
          },
        ],
      });
    }

    // if defined
    // compare password
    let comparedPwd = await comparePassword(data.password, user.password);
    // if not match
    if (!comparedPwd) {
      return res.status(401).json({
        status: "error",
        errors: [
          {
            message: "The Password is incorrect",
            code: 401,
            field: "password",
          },
        ],
      });
    }

    // if match
    // generate token
    let accessToken = await generateAccessToken({
      uid: user._id.toHexString(),
      role: user.role,
    });
    let refreshToken = await generateRefreshToken({
      uid: user._id.toHexString(),
      role: user.role,
    });
    // save access token to cookie
    res.cookie("access_token", accessToken, {
      httpOnly: true,
    });
    // save refresh token to cookie
    // res.cookie("refresh_token", refreshToken, {
    //   httpOnly: true,
    // });
    req.app.locals.Session = refreshToken;

    return res
      .status(200)
      .json({
        status: "success",
        data: { accessToken },
        code: 200,
      })
      .end();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      errors: [
        {
          message: "Internal server error",
          code: 500,
          data: error,
        },
      ],
    });
  }
};

const recover = async (req, res) => {
  try {
    let { email, password } = req.body;

    // checkpoint
    let user = await UserModel.findOne({ email });
    // if undefined
    if (!user) {
      return res.status(400).json({
        status: "error",
        errors: [
          {
            message: "The Email you entered doesn't belong to any account",
            code: 400,
            field: "email",
          },
        ],
      });
    }
    // if defined
    // hashing password
    let hashedPwd = await hashPassword(password, ENV.SECURITY.SALT_ROUNDS);

    // updating
    UserModel.findOneAndUpdate(
      { _id: user._id.toHexString() },
      { password: hashedPwd },
      { new: true }
    )
      .then((result) => {
        return res.sendStatus(204).end();
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      errors: [
        {
          message: "Internal server error",
          code: 500,
          data: error,
        },
      ],
    });
  }
};

export { register, login, recover };
