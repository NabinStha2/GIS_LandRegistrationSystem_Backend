const { SetErrorResponse } = require("../utils/responseSetter");

module.exports.checkIsAdmin = (req, res, next) => {
  try {
    const isAdmin = res.locals.authData?.isAdmin;

    if (!isAdmin) {
      throw new SetErrorResponse("Unauthorized!,Must be admin", 401);
    }
    next();
  } catch (err) {
    return res.fail(err);
  }
};
