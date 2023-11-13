import { UserModel } from "../models/User.model.js";

export default async (req, res, next) => {
  try {
    const { username } = req.body;
    // checkpoint
    let user = await UserModel.find({ username });
    // if not found
    if (!user)
      return res.status(404).json({
        message: "The username you entered doesn't belong to an account.",
        data: { username },
      });
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error.",
      data: error,
    });
  }
};
