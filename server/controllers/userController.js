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
    return res.status(500).json({
      errorStatus: true,
      errorCode: "server/unknown_error",
      errorMessage: "Internal server error.",
      data: {},
    });
  }
};

export { getUser };
