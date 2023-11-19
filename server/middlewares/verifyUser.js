import logger from "../logs/logger.js";
import { UserModel } from "../models/User.model.js";

const verifyUser = async (req, res, next) => {
  try {
    const { username } = req.body;
    // checkpoint
    let user = await UserModel.findOne({ username });
    // if not found
    if (!user)
      return res.status(404).json({
        errorStatus: true,
        errorCode: "auth/not_found",
        errorMessage: "The account you entered doesn't belong to an account.",
        data: { username },
      });
    next();
  } catch (error) {
    logger.log("error", error);

    return res.status(500).json({
      errorStatus: true,
      errorCode: "server/unknown_error",
      errorMessage: "Internal server error.",
      data: { error },
    });
  }
};

export { verifyUser };
