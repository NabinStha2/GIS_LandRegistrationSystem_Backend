const User = require("../models/user.model");
const { SetErrorResponse } = require("../utils/responseSetter");

module.exports.checkIsUserVerified = async (req, res, next) => {
  try {
    const existingUser = await User.findById({
      _id: res.locals.authData?._id,
    }).lean();

    if (!existingUser || existingUser?.isVerified != "approved") {
      throw new SetErrorResponse("User not verified", 401);
    }

    next();
  } catch (err) {
    return res.fail(err);
  }
};
