const jwt = require("jsonwebtoken");
const { customSecretKey } = require("../utils/customSecretKey");
const User = require("../models/user.model");
const { SetErrorResponse } = require("../utils/responseSetter");

exports.checkAuthValidation = async (req, res, next) => {
  let token;
  try {
    if (!req.headers.authorization) {
      throw new SetErrorResponse("Auth Token Not Found", 401);
    }

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const isCustomAuth = token.length < 500;

        const datas = jwt.decode(token);
        if (!datas) throw new SetErrorResponse("Invalid token");

        let user = await User.findOne({ _id: datas._id });
        console.log(
          "user authentication id: " +
            req.params.userId +
            " : " +
            user._id +
            " : " +
            datas._id
        );

        if (!user) {
          throw new SetErrorResponse(`User Not Found:`, 401);
        }

        if (token && isCustomAuth) {
          const data = jwt.verify(token, customSecretKey(datas._id));
          res.locals.authData = data;
          res.locals.authData.success = true;

          if (res.locals.authData?._id) {
            const userId = res.locals.authData._id;
            console.log(userId);
          }
        }
        if (!res.locals.authData || !res.locals?.authData?.success) {
          // console.log(res.locals.authData)
          return res
            .status(res?.locals?.authData?.status || 500)
            .send({ message: res?.locals?.authData?.message });
        }
      } catch (err) {
        throw new SetErrorResponse(
          `Access Not Granted ! Please Login Again: ${err}`,
          401
        );
      }
    }
    next();
  } catch (error) {
    res.fail(error);
  }
};
