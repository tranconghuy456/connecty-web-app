import * as ENV from "../config/config.js";
import logger from "../logs/logger.js";
import { UserModel, UserTokenModel } from "../models/User.model.js";
import { generateAT, generateRT } from "../utils/useToken.js";
import bcrypt from "bcrypt";

// POST: {SERVER_API}/register
// params: {firstname, lastname, age, phone, job, username, email, password, role, isActived, createdAt, updatedAt}
const register = async (req, res) => {
  try {
    const { password, username, email, ...next } = req.body;
    // check existance
    let isEmailExist = await UserModel.findOne({ email });
    let isUsernameExist = await UserModel.findOne({ username });

    // if username is exist
    if (isUsernameExist)
      return res.status(409).json({
        errorStatus: true,
        errorCode: "create/conflict",
        errorMessage: "The username is already in use.",
        data: {
          field: "username",
          value: username,
        },
      });

    // if email is exist
    if (isEmailExist)
      return res.status(409).json({
        errorStatus: true,
        errorCode: "create/conflict",
        errorMessage: "The email is already in use.",
        data: {
          field: "email",
          value: email,
        },
      });

    // if not exist
    // hash password
    bcrypt.hash(password, ENV.TOKEN.SALT_ROUNDS).then((hashedPwd) => {
      // User schema -> save profile
      new UserModel({
        username,
        email,
        password: hashedPwd,
        ...next,
      })
        .save()
        .then(() => {
          // if succeed
          return res.status(201).json({
            errorStatus: false,
            errorCode: {},
            errorMessage: {},
            data: { ...next },
          });
        })
        .catch((error) => {
          // if failed
          throw Error(error);
        });
    });
  } catch (error) {
    // register failed
    logger.log("error", error);

    return res.status(500).json({
      errorStatus: true,
      errorCode: "server/unknown_error",
      errorMessage: "Internal server error.",
      data: { error },
    });
  }
};

// POST: {SERVER_API}/login
// params: {username, password}
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // get user
    let user = await UserModel.findOne({ username });

    // compared password
    let comparedPwd = await bcrypt.compare(password, user.password);
    // if not match
    if (!comparedPwd)
      return res.status(404).json({
        errorStatus: true,
        errorCode: "auth/not_found",
        errorMessage: "Password is incorrect.",
        data: {
          field: "password",
          value: password,
        },
      });

    // if match
    // generate AT
    let accessToken = await generateAT({
      uid: user._id.toHexString(),
      roles: user.roles,
    });
    let refreshToken = await generateRT({
      uid: user._id.toHexString(),
      roles: user.roles,
    });
    // saving RT to db
    let userToken = UserTokenModel({
      token: refreshToken,
      roles: user.roles,
      uid: user._id.toHexString(),
      exp: ENV.TOKEN.REFRESH_TOKEN_EXP,
    }).save();
    // if saving failed
    if (!userToken) {
      return res.status(401).send({
        errorStatus: true,
        errorCode: "auth/unathorized",
        errorMessage: "Unauthorized.",
        data: {},
      });
    }

    // if saved
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    // Send authorization roles and access token to user
    return res.status(200).json({
      errorStatus: false,
      errorCode: {},
      errorMessage: {},
      data: {
        accessToken: accessToken,
        roles: user.roles,
      },
    });
  } catch (error) {
    // login failed
    logger.log("error", error);

    return res.status(500).json({
      errorStatus: true,
      errorCode: "server/unknown_error",
      errorMessage: "Internal server error.",
      data: { error },
    });
  }
};

// POST: {SERVER_API}/logout
const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.["refreshToken"]) return res.status(204); // no content

  const refreshToken = cookies["refreshToken"];
  // check existance
  let isTokenExist = await UserTokenModel.findOne({ refreshToken });

  if (!isTokenExist) {
    // if not exist
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return res.status(204);
  }

  // if exist
  // delete RT in db
  isTokenExist["refreshToken"] = "";
  // saving changes
  const result = await isTokenExist.save();
  if (!result)
    // if cannot save
    return res.status(501).json({
      errorStatus: true,
      errorCode: "auth/unauthorized",
      errorMessage: "Access is denied.",
      data: {},
    });
  // saved
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(204);
};

// GET: {SERVER_API}/users/:username
// params: {username}
const getUser = async (req, res) => {
  try {
    const { username } = req.params;
    // invalid query
    if (!username)
      return res.status(501).json({
        errorStatus: true,
        errorCode: "server/invalid_query",
        errorMessage: "Invalid query.",
        data: {},
      });

    let user = await UserModel.findOne({ username });
    // if not exist
    if (!user)
      return res.status(404).json({
        errorStatus: true,
        errorCode: "users/not_found",
        errorMessage: "The username you entered doesn't belong to an account.",
        data: {
          field: "username",
          value: username,
        },
      });
    // if exist
    let { password, ...next } = user._doc;
    return res.status(200).json({
      errorStatus: false,
      errorCode: {},
      errorMessage: {},
      data: { ...next },
    });
  } catch (error) {
    logger.log("error", error);

    return res.status(500).json({
      errorStatus: true,
      errorCode: "server/unknown_error",
      errorMessage: "Internal server error.",
      data: {},
    });
  }
};
export { register, login, logout, getUser };
