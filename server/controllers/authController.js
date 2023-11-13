import * as ENV from "../config/config.js";
import { UserModel, UserTokenModel } from "../models/User.model.js";
import { generateAT, generateRT } from "../utils/useToken.js";
import bcrypt from "bcrypt";

// POST: {SERVER_API}/register
// params: {firstname, lastname, age, phone, job, username, email, password, role, isActived, createdAt, updatedAt}
const register = async (req, res) => {
  try {
    const { password, username, email, ...etc } = req.body;
    // check existance
    let isEmailExist = await UserModel.findOne({ email });
    let isUsernameExist = await UserModel.findOne({ username });
    // if username is exist
    if (isUsernameExist)
      return res.status(400).json({
        message: "The username is already in use.",
        data: { element: "username" },
      });
    // if email is exist
    if (isEmailExist)
      return res.status(400).json({
        message: "The email is already in use.",
        data: { element: "email" },
      });

    // if not exist
    // hash password
    bcrypt.hash(password, ENV.TOKEN.SALT_ROUNDS).then((hashedPwd) => {
      // User schema -> save profile
      new UserModel({
        ...etc,
        username,
        email,
        password: hashedPwd,
      })
        .save()
        .then(() => {
          // if succeed
          return res.status(201).json({
            message: "Register successfully.",
            data: { ...etc },
          });
        })
        .catch((error) => {
          // if failed
          return res.status(501).json({
            message: "Access is denied.",
            data: error,
          });
        });
    });
  } catch (error) {
    // register failed
    return res.status(500).json({
      message: "Internal server error.",
      data: error,
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
      return res.status(401).json({
        message: "Password is incorrect.",
        data: { element: "password" },
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
      return res.status(401).send({ message: "Unauthorized." });
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
      message: "Login successfully.",
      data: { accessToken: accessToken, roles: user.roles },
    });
  } catch (error) {
    // login failed
    return res.status(500).json({
      message: "Internal server error.",
      data: error,
    });
  }
};

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
  isTokenExist.refreshToken = "";
  // saving changes
  const result = await isTokenExist.save();
  if (!result)
    // if cannot save
    return res.status(501).json({
      message: "Access is denied.",
    });
  // saved
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(204);
};

const verifyRT = async (req, res) => {
  const refreshToken = req.cookies["refreshToken"];
  // if invalid
  if (!refreshToken)
    return res
      .status(401)
      .json({ message: "Invalid token.", data: refreshToken });

  // if valid
  try {
    // get user id
    let user = UserTokenModel.findOne({ refreshToken });
    // if not found
    if (!user)
      return res
        .status(401)
        .json({ message: "Invalid token.", data: refreshToken });
    // if found
    jwt.verify(
      refreshToken,
      ENV.TOKEN.REFRESH_TOKEN_PRIVATE_KEY,
      async (error, payload) => {
        if (error || user._id.toHexString() !== payload.uid)
          return res
            .status(401)
            .json({ message: "Invalid token.", data: refreshToken });

        // return access token
        return await jwt.sign({
          user: {
            uid: payload.uid,
            roles: user.roles,
          },
        });
      }
    );
  } catch (error) {}
};

export { register, login, logout, verifyRT };
